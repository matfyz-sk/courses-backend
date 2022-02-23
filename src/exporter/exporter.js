//import * as models from "../model/index.js";
let models = require("../model/index.js");

const DATA_PREFIX = "";
const ONTOLOGY_PREFIX = "";

function exportOntology() {
    console.log("here");
    let ontology = [];
    for (let model in models) {
        console.log(model.type);
    }
    return ontology;
}

exportOntology();