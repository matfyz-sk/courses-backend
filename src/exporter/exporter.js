import * as models from "../model/index.js";
import bcrypt from "bcrypt";

//npm install && npm install -g babel-cli
//npx babel-node src/exporter/exporter.js

const PREFIXES = {
    courses: {prefix: "courses", uri: "http://www.courses.matfyz.sk/ontology#"},
    coursesData: {prefix: "courses-data", uri: "http://www.courses.matfyz.sk/data"},
    rdfs: {prefix: "rdfs", uri: "http://www.w3.org/2000/01/rdf-schema#"},
    rdf: {prefix: "rdf", uri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#"},
    schema: {prefix: "schema", uri: "http://schema.org/"},
    owl: {prefix: "owl", uri: "http://www.w3.org/2002/07/owl#"},
    xsd: {prefix: "xsd", uri: "http://www.w3.org/2001/XMLSchema#"},
};

const RDFS_TYPE = " a ";

function getAdminSettings() {
    const PASSWORD = "admin123";
    const NAME = "Admin";
    const hash = bcrypt.hashSync(PASSWORD, 10);

    return {
        firstName: NAME,
        lastName: NAME,
        email: "admin@admin.admin",
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
        identifier: "s3MzY"
    }
}

function getSchemaLiteral(object) {
    if (typeof object == "boolean") {
        return "\"" + object.toString() + "\"^^" + PREFIXES.xsd.prefix + ":boolean";
    }
    return "\"" + object + "\"";
}

function firstLetterToUppercase(value) {
    return value && value.length > 0 ? (value[0].toUpperCase() + value.slice(1)) : value;
}

//string, datetime, boolean, float, integer, node
function getTypeOfProperty(dataType) {
    if (dataType === "node") {
        return "ObjectProperty";
    }
    return "DatatypeProperty";
}

function exportOntology() {

    Object.values(PREFIXES).map((prefixItem) => {
        console.log("PREFIX " + prefixItem.prefix + ": <" + prefixItem.uri + ">");
    });

    console.log("");

    Object.values(models).map((model) => {
        let className;
        if (model.type) {
            className = firstLetterToUppercase(model.type);
            console.log(PREFIXES.courses.prefix + ":" + className + RDFS_TYPE + PREFIXES.rdfs.prefix + ":Class .");
        }
        if (model.subclassOf && model.subclassOf.type) {
            console.log(PREFIXES.courses.prefix + ":" + className + " " + PREFIXES.rdfs.prefix + ":subClassOf " + PREFIXES.courses.prefix + ":" + firstLetterToUppercase(model.subclassOf.type) + " .");
        }

        if (model.subclasses) {
            for (let subclass of model.subclasses) {
                console.log(PREFIXES.courses.prefix + ":" + firstLetterToUppercase(subclass) + " " + PREFIXES.rdfs.prefix + ":subClassOf " + PREFIXES.courses.prefix + ":" + className + " .");
            }
        }
        if (model.props) {
            Object.entries(model.props).map(([propertyName, propertyObject]) => {
                console.log(PREFIXES.courses.prefix + ":" + propertyName + " " + PREFIXES.schema.prefix + ":domainIncludes " + PREFIXES.courses.prefix + ":" + className + " .");

                if (propertyObject) {
                    if (propertyObject.objectClass) {
                        console.log(PREFIXES.courses.prefix + ":" + propertyName + " " + PREFIXES.schema.prefix + ":rangeIncludes " + PREFIXES.courses.prefix + ":" + firstLetterToUppercase(propertyObject.objectClass) + " .");
                    }
                    if (propertyObject.dataType) {
                        console.log(PREFIXES.courses.prefix + ":" + propertyName + RDFS_TYPE + PREFIXES.owl.prefix + ":" + getTypeOfProperty(propertyObject.dataType) + " .");
                    }
                }
            });
        }
        console.log("");
    });

    let adminSettings = getAdminSettings();
    let userIri = "<" + PREFIXES.coursesData.uri + (PREFIXES.coursesData.uri.lastIndexOf("/") === (PREFIXES.coursesData.uri.length - 1) ? "" : "/") + "user/" + adminSettings.identifier + ">";

    console.log(userIri + RDFS_TYPE + PREFIXES.courses.prefix + ":User" + " .");
    Object.entries(adminSettings).map(([fieldName, fieldValue]) => {
        console.log(userIri + " " + PREFIXES.courses.prefix + ":" + fieldName + " " + getSchemaLiteral(fieldValue) + " .");
    })
}

exportOntology();