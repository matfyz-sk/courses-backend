import bcrypt from "bcrypt";
import * as models from "../model/index.js";
import {
    DATA_IRI,
    ONTOLOGY_IRI,
    ONTOLOGY_VERSION,
    PASSWORD_SALT,
    SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_NAME,
    SUPER_ADMIN_PASSWORD
} from "../constants/index.js";
import _ from "lodash";
import chalk from "chalk";
import {className, dateTime} from "../helpers/index.js";

function warning(data, ...args) {
    console.warn(chalk.yellow(`[${dateTime()}] Warning: `) + data, ...args);
}

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
        const ontologyArray = [];
        const properties = new Map();

        this.addOntologyMetadata(ontologyArray);
        this.addResourceCreated(ontologyArray, properties);

        Object.values(models).map((model) => {
            if (!model.type) {
                // It makes no sense to continue with this class
                warning(`Model without the type field: ${chalk.bold(model)}`);
                return;
            }
            const className = this.firstLetterToUppercase(model.type);
            ontologyArray.push(this.getTriple(PREFIXES.courses, className, PREFIXES.rdf, "type", PREFIXES.rdfs, "Class"));
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
                properties.get(COURSES_CREATED_PROPERTY)[0].classes.push(className);

                Object.entries(model.props).map(([propertyName, propertyObject]) => {
                    ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.schema, "domainIncludes", PREFIXES.courses, className));
                    if (!propertyObject) {
                        warning(`Unspecified property: ${chalk.bold(className)}.${chalk.bold(propertyName)}`);
                        return;
                    }

                    const spec = {};

                    if (propertyObject.dataType) {
                        ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.rdf, "type", PREFIXES.owl, this.getTypeOfProperty(propertyObject.dataType)));
                    }
                    spec.dataType = propertyObject.dataType;

                    if (propertyObject.dataType && this.getScalarTypes().includes(propertyObject.dataType)) {
                        ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.schema, "rangeIncludes", PREFIXES.xsd, propertyObject.dataType));
                    }
                    if (propertyObject.objectClass) {
                        spec.objectClass = propertyObject.objectClass;
                        ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.schema, "rangeIncludes", PREFIXES.courses, this.firstLetterToUppercase(propertyObject.objectClass)));
                    }

                    spec.multiple = propertyObject.multiple;
                    if (!propertyObject.multiple) {
                        ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.rdf, "type", PREFIXES.owl, "FunctionalProperty"));
                        ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.rdf, "type", PREFIXES.owl, propertyObject.objectClass ? "FunctionalObjectProperty" : "FunctionalDataProperty"));
                    }
                    spec.required = propertyObject.required;
                    // FIXME: This is wrong! But UGQL needs to be fixed, too.
                    ontologyArray.push(this.getLiteralTriple(PREFIXES.courses, propertyName, PREFIXES.owl, "minCardinality", propertyObject.required ? 1 : 0, "xsd:nonNegativeInteger"));

                    const prevSpecs = properties.has(propertyName)
                        ? properties.get(propertyName)
                        : [];
                    const same = prevSpecs.filter(
                        (prevClassesSpec) => _.isEqual(spec, prevClassesSpec.spec)
                    );
                    if (same.length > 0) {
                        same[0].classes.push(className);
                    } else {
                        prevSpecs.push({ classes: [className], spec });
                        properties.set(propertyName, prevSpecs);
                    }
                });
            }
        });

        const propNames = Array.from(properties.keys());
        propNames.sort();
        for (const prop of propNames) {
            ontologyArray.push(this.getTriple(PREFIXES.courses, prop, PREFIXES.rdf, "type", PREFIXES.rdf, "Property"));

            const equivSpecs = properties.get(prop);
            if (equivSpecs.length > 1) {
                equivSpecs.sort((cs1, cs2) => cs1.classes.length - cs2.classes.length)
                warning(`Property ${chalk.bold(prop)} specified differently in ${
                    equivSpecs.map(({classes}) =>
                        `{${classes.map(cls => chalk.bold(cls)).join(', ')}}`
                    ).join(' than in ')
                }`);
                const dataPropIn = equivSpecs.filter(({spec}) => spec.dataType != 'node').flatMap(({classes}) => classes);
                const objPropIn = equivSpecs.filter(({spec}) => spec.dataType == 'node').flatMap(({classes}) => classes);
                if (dataPropIn.length > 0 && objPropIn.length > 0) {
                    warning(chalk.red(`${chalk.bold(prop)} is a data property in {${dataPropIn.map(cls => chalk.bold(cls)).join(', ')}} and an object property in {${objPropIn.map(cls => chalk.bold(cls)).join(', ')}}`));
                }
            }
        }

        return ontologyArray;
    }

    addOntologyMetadata(ontologyArray) {
        const ontologyIRI = ONTOLOGY_IRI.endsWith('#') || ONTOLOGY_IRI.endsWith('/')
            ? ONTOLOGY_IRI.slice(0, ONTOLOGY_IRI.length - 1)
            : ONTOLOGY_IRI;
        ontologyArray.push(this.getTriple(ontologyIRI, "", PREFIXES.rdf, "type", PREFIXES.owl, "Ontology"));
        ontologyArray.push(this.getLiteralTriple(ontologyIRI, "", PREFIXES.owl, "versionInfo", ONTOLOGY_VERSION, null));
    }

    addResourceCreated(ontologyArray, properties) {
        ontologyArray.push(this.getTriple(PREFIXES.courses, COURSES_CREATED_PROPERTY, PREFIXES.rdf, "type", PREFIXES.owl, "DatatypeProperty"));
        ontologyArray.push(this.getTriple(PREFIXES.courses, COURSES_CREATED_PROPERTY, PREFIXES.rdf, "type", PREFIXES.owl, "FunctionalProperty"));
        ontologyArray.push(this.getTriple(PREFIXES.courses, COURSES_CREATED_PROPERTY, PREFIXES.rdf, "type", PREFIXES.owl, "FunctionalDataProperty"));
        ontologyArray.push(this.getTriple(PREFIXES.courses, COURSES_CREATED_PROPERTY, PREFIXES.rdfs, "subPropertyOf", PREFIXES.dcterms, CREATED_PROPERTY));
        ontologyArray.push(this.getTriple(PREFIXES.courses, COURSES_CREATED_PROPERTY, PREFIXES.schema, "rangeIncludes", PREFIXES.xsd, "dateTime"));
        properties.set(COURSES_CREATED_PROPERTY, [{
            classes: [],
            spec: {
                required: false,
                multiple: false,
                dataType: 'dateTime'
            }
        }]);
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