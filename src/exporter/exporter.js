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
    xsd: "http://www.w3.org/2001/XMLSchema#"
};

export class Exporter {

    constructor() {
        if (this.constructor === Exporter) {
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
        }
    };

    exportOntology() {
        throw new Error("Method 'exportOntology()' must be implemented.");
    }

    getCommonOntology() {
        let ontologyArray = [];

        const properties = new Set();

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
                Object.entries(model.props).map(([propertyName, propertyObject]) => {
                    ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.schema, "domainIncludes", PREFIXES.courses, className));
                    if (propertyObject) {

                        properties.add(propertyName);

                        if (propertyObject.objectClass) {
                            ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.schema, "rangeIncludes", PREFIXES.courses, this.firstLetterToUppercase(propertyObject.objectClass)));
                        }
                        if (propertyObject.dataType) {
                            ontologyArray.push(this.getTriple(PREFIXES.courses, propertyName, PREFIXES.rdf, "type", PREFIXES.owl, this.getTypeOfProperty(propertyObject.dataType)));
                        }
                    }
                });
            }
        });

        for (const item of properties.values()) {
            ontologyArray.push(this.getTriple(PREFIXES.courses, item, PREFIXES.rdf, "type", PREFIXES.rdf, "Property"));
        }

        return ontologyArray;
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

    //string, datetime, boolean, float, integer, node
    getTypeOfProperty(dataType) {
        if (dataType === "node") {
            return "ObjectProperty";
        }
        return "DatatypeProperty";
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
        throw new Error("Method 'getSchemaLiteral(object)' must be implemented.");
    }

}