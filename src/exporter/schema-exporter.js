import bcrypt from "bcrypt";
import * as models from "../model";
import {
    DATA_IRI,
    ONTOLOGY_IRI,
    PASSWORD_SALT,
    SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_NAME,
    SUPER_ADMIN_PASSWORD
} from "../constants";
import _ from "lodash";

export const PREFIXES = {
    courses: ONTOLOGY_IRI,
    coursesData: DATA_IRI,
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    schema: "http://schema.org/",
    owl: "http://www.w3.org/2002/07/owl#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    dcterms: "http://purl.org/dc/terms/"
};

export const SCALAR_TYPE = {
    string: PREFIXES.xsd + "string",
    boolean: PREFIXES.xsd + "boolean",
    integer: PREFIXES.xsd + "integer",
    dateTime: PREFIXES.xsd + "dateTime",
    float: PREFIXES.xsd + "float",
    decimal: PREFIXES.xsd + "decimal",
    long: PREFIXES.xsd + "long",
    short: PREFIXES.xsd + "short"
}

const CREATED_PROPERTY = "created";
const COURSES_CREATED_PROPERTY = "createdAt";

export class SchemaExporter {

    constructor() {
        if (this.constructor === SchemaExporter) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    getAdminSettings() {
        const PASSWORD = SUPER_ADMIN_PASSWORD;
        const NAME = SUPER_ADMIN_NAME;
        const hash = bcrypt.hashSync(PASSWORD, PASSWORD_SALT);

        return {
            firstName: NAME,
            lastName: NAME,
            email: SUPER_ADMIN_EMAIL,
            password: hash,
            description: "",
            nickname: NAME,
            useNickName: true,
            publicProfile: false,
            showCourses: false,
            showBadges: false,
            allowContact: false,
            nickNameTeamException: true,
            isSuperAdmin: true,
            createdAt: new Date().toISOString()
        }
    };

    exportOntology() {
        throw new Error("Method 'exportOntology()' must be implemented.");
    }

    getCommonOntology() {
        let ontologyArray = [];

        const properties = new Set();

        this.addResourceCreated(ontologyArray);

        Object.values(models).map((model) => {
            let className;
            if (model.type) {
                className = this.firstLetterToUppercase(model.type);
                ontologyArray.push(this.getTriple(PREFIXES.courses, className, PREFIXES.rdf, "type", PREFIXES.rdfs, "Class"));
            }
            if (model.subclassOf && model.subclassOf.type) {
                ontologyArray.push(this.getTriple(PREFIXES.courses, className, PREFIXES.rdfs, "subClassOf", PREFIXES.courses, this.firstLetterToUppercase(model.subclassOf.type)));
            }

            if (model.subclasses) {
                for (let subclass of model.subclasses) {
                    ontologyArray.push(this.getTriple(PREFIXES.courses, this.firstLetterToUppercase(subclass), PREFIXES.rdfs, "subClassOf", PREFIXES.courses, className));
                }
            }
            if (model.props) {
                ontologyArray.push(this.getTriple(PREFIXES.courses, COURSES_CREATED_PROPERTY, PREFIXES.schema, "domainIncludes", PREFIXES.courses, className)); // Add prop created to the given class

                Object.entries(model.props).map(([propertyName, propertyObject]) => {
                    ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.schema, "domainIncludes", PREFIXES.courses, className));
                    if (propertyObject) {
                        properties.add(propertyName);

                        if (propertyObject?.dataType && this.getScalarTypes().includes(propertyObject.dataType)) {
                            ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.schema, "rangeIncludes", PREFIXES.xsd, propertyObject.dataType));
                        }

                        if (propertyObject.objectClass) {
                            ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.schema, "rangeIncludes", PREFIXES.courses, this.firstLetterToUppercase(propertyObject.objectClass)));
                        }
                        if (propertyObject.dataType) {
                            ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.rdf, "type", PREFIXES.owl, this.getTypeOfProperty(propertyObject.dataType)));
                        }
                        if (!propertyObject.multiple) {
                            ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.rdf, "type", PREFIXES.owl, "FunctionalProperty"));
                            ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.rdf, "type", PREFIXES.owl, propertyObject.objectClass ? "FunctionalObjectProperty" : "FunctionalDataProperty"));
                        }
                        ontologyArray.push(this.getLiteralTriple(PREFIXES.courses, propertyName, PREFIXES.owl, "minCardinality", propertyObject.required ? 1 : 0, "xsd:nonNegativeInteger"));
                    }
                });
            }
        });

        properties.add(COURSES_CREATED_PROPERTY);
        for (const item of properties.values()) {
            ontologyArray.push(this.getTriple(PREFIXES.courses, item, PREFIXES.rdf, "type", PREFIXES.rdf, "Property"));
        }

        return ontologyArray;
    }

    addResourceCreated(ontologyArray) {
        ontologyArray.push(this.getTriple(PREFIXES.courses, COURSES_CREATED_PROPERTY, PREFIXES.rdf, "type", PREFIXES.owl, "DatatypeProperty"));
        ontologyArray.push(this.getTriple(PREFIXES.courses, COURSES_CREATED_PROPERTY, PREFIXES.rdf, "type", PREFIXES.owl, "FunctionalProperty"));
        ontologyArray.push(this.getTriple(PREFIXES.courses, COURSES_CREATED_PROPERTY, PREFIXES.rdf, "type", PREFIXES.owl, "FunctionalDataProperty"));
        ontologyArray.push(this.getTriple(PREFIXES.courses, COURSES_CREATED_PROPERTY, PREFIXES.rdfs, "subPropertyOf", PREFIXES.dcterms, CREATED_PROPERTY));
        ontologyArray.push(this.getTriple(PREFIXES.courses, COURSES_CREATED_PROPERTY, PREFIXES.schema, "rangeIncludes", PREFIXES.xsd, "dateTime"));
    }


    getScalarTypes() {
        /* If a new type is added here then it must be also added into UltraGraphQL @see RDFtoHGQL#buildField */
        return ["integer", "string", "boolean", "float", "dateTime", "decimal", "long", "short"];
    }

    async getUserOntology() {
        const userArray = [];
        const createUserIriIdentifier = await this.createUserIriIdentifier();
        const userIri = this.getUserIri(_.isString(createUserIriIdentifier) ? createUserIriIdentifier : createUserIriIdentifier.iri);
        const adminSettings = this.getAdminSettings();

        userArray.push(this.getUserTypeTriple(userIri));

        Object.entries(adminSettings).map(([fieldName, fieldValue]) => {
            userArray.push(this.getAdminTriple(userIri, fieldName, fieldValue));
        });
        return userArray;
    }

    getTypeOfProperty(dataType) {
        if (dataType === "node") {
            return "ObjectProperty";
        }
        return "DatatypeProperty"; /* Scalar type - integer, string, boolean, float, dateTime, decimal, long, short */
    }

    firstLetterToUppercase(value) {
        if (value.length < 1) {
            return value;
        }
        let val;
        if (_.isArray(value)) {
            val = value[0];
        } else {
            val = value;
        }
        return val[0].toUpperCase() + val.slice(1);
    }

    getTriple(sprefix, s, pprefix, p, oprefix, o) {
        throw new Error("Method 'exportTriple(sprefix, s, pprefix, p, oprefix, o)' must be implemented.");
    };

    getUserTypeTriple(userIri) {
        throw new Error("Method 'getUserTriple(userIri)' must be implemented.");
    }

    getAdminTriple(userIri, fieldName, fieldValue) {
        throw new Error("Method ' exportAdminSettings(userIri, fieldName, fieldValue)' must be implemented.");
    }

    getPrefixes() {
        throw new Error("Method 'getPrefixes()' must be implemented.");
    }

    getUserIri(userIriString) {
        throw new Error("Method 'getUserIri(userIriString)' must be implemented.");
    }

    getSchemaLiteral(object) {
        throw new Error("Method 'getSchemaLiteral(object)' must be implemented.");
    }

    createUserIriIdentifier() {
        throw new Error("Method 'createUserIriIdentifier()' must be implemented.");
    }

    getLiteralTriple(sprefix, s, pprefix, p, literalValue, literalType) {
        throw new Error("Method 'getLiteralTriple(sprefix, s, pprefix, p, literalValue, literalType)' must be implemented.");
    }

    isFloat(num) {
        return Number(num) === num && num % 1 !== 0;
    }

    isIsoDate(str) {
        if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
        const d = new Date(str);
        return d instanceof Date && !isNaN(d) && d.toISOString() === str; //is valid ISO date
    }

}