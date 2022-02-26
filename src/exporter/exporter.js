import * as models from "../model/index.js";

const PREFIXES = {
    courses: {prefix: "courses", uri: "http://www.courses.matfyz.sk/ontology#"},
    coursesData: {prefix: "courses-data", uri: "http://www.courses.matfyz.sk/data/"},
    rdfs: {prefix: "rdfs", uri: "http://www.w3.org/2000/01/rdf-schema#"}
};

const RDFS_TYPE = "a";

//npm install && npm install -g babel-cli
//npx babel-node src/exporter/exporter.js

function firstLetterToUppercase(value) {
    return value && value.length > 0 ? (value[0].toUpperCase() + value.slice(1)) : value;
}

function exportOntology() {

    Object.values(PREFIXES).map((prefixItem) => {
        console.log("PREFIX " + prefixItem.prefix + ": <" + prefixItem.uri + ">")
    })

    console.log("\n");

    Object.values(models).map((model) => {
        if (model.type) {
            console.log(PREFIXES.courses.prefix + ":" + firstLetterToUppercase(model.type) + " " + RDFS_TYPE + " " + PREFIXES.rdfs.prefix + ":Class");
        }
    })
}

exportOntology();