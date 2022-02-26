import * as models from "../model/index.js";

const PREFIXES = {
    courses: {prefix: "courses", uri: "http://www.courses.matfyz.sk/ontology#"},
    coursesData: {prefix: "courses-data", uri: "http://www.courses.matfyz.sk/data/"},
    rdfs: {prefix: "rdfs", uri: "http://www.w3.org/2000/01/rdf-schema#"},
    schema: {prefix: "schema", uri: "http://schema.org/"},
    owl: {prefix: "owl", uri: "http://www.w3.org/2002/07/owl#"},
};

const RDFS_TYPE = " a ";

//npm install && npm install -g babel-cli
//npx babel-node src/exporter/exporter.js

function firstLetterToUppercase(value) {
    return value && value.length > 0 ? (value[0].toUpperCase() + value.slice(1)) : value;
}

function getTypeOfProperty(dataType) {
    if (dataType === "string" || dataType === "dateTime") {
        return "DatatypeProperty";
    }
    if (dataType === "node") {
        return "ObjectProperty";
    }
    return "ObjectProperty";
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
            console.log(PREFIXES.courses.prefix + ":" + className + RDFS_TYPE + PREFIXES.rdfs.prefix + ":Class");
        }
        if (model.subclassOf && model.subclassOf.type) {
            console.log(PREFIXES.courses.prefix + ":" + className + " " + PREFIXES.rdfs.prefix + ":subClassOf " + PREFIXES.courses.prefix + ":" + firstLetterToUppercase(model.subclassOf.type));
        }

        if (model.subclasses) {
            for (let subclass of model.subclasses) {
                console.log(PREFIXES.courses.prefix + ":" + firstLetterToUppercase(subclass) + " " + PREFIXES.rdfs.prefix + ":subClassOf " + PREFIXES.courses.prefix + ":" + className);
            }
        }
        if (model.props) {
            Object.entries(model.props).map(([propertyName, propertyObject]) => {
                console.log(PREFIXES.courses.prefix + ":" + propertyName + " " + PREFIXES.schema.prefix + ":domainIncludes " + PREFIXES.courses.prefix + ":" + className);

                if (propertyObject) {
                    if (propertyObject.objectClass) {
                        console.log(PREFIXES.courses.prefix + ":" + propertyName + " " + PREFIXES.schema.prefix + ":rangeIncludes " + PREFIXES.courses.prefix + ":" + className);
                    }
                    if (propertyObject.dataType) {
                        console.log(PREFIXES.courses.prefix + ":" + propertyName + RDFS_TYPE + PREFIXES.owl.prefix + ":" + getTypeOfProperty(propertyObject.dataType));
                    }
                }
            });
        }
        console.log("");
    });
}

exportOntology();