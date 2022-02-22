import * as models from "../model/index.js";

export function exportOntology() {
    let btn = document.getElementById("export_btn");
    btn.addEventListener("click", () => {
        window.alert("hey");
        console.log("here");
        let ontology = [];
        for (let model in models) {
            console.log(model.type);
        }
        return ontology;
    })
}

window.onload = exportOntology;