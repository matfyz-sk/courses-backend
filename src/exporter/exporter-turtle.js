import {Exporter, PREFIXES} from "./exporter";

//npm install && npm install -g babel-cli
//npx babel-node src/exporter/exporter-turtle.js

export class ExporterTurtle extends Exporter {

    exportOntology() {
        this.getPrefixes();
        console.log("");

        const commonOntology = this.getCommonOntology();

        commonOntology.map((item) => {
                console.log(item);
            }
        );
        console.log("");

        const userOntology = this.getUserOntology();

        userOntology.map((item) => {
                console.log(item);
            }
        );
    }

    getTriple(sprefix, s, pprefix, p, oprefix, o) {
        return sprefix + s + " " + pprefix + p + " " + oprefix + o + " .";
    }

    getUserTypeTriple() {
        return this.getUserIri() + " " + PREFIXES.rdf + "type" + " " + PREFIXES.courses + "User" + " .";
    }

    getAdminTriple(userIri, fieldName, fieldValue) {
        return userIri + " " + PREFIXES.courses + fieldName + " " + this.getSchemaLiteral(fieldValue) + " .";
    }

    getPrefixes() {
        Object.entries(PREFIXES).map(([prefixName, prefixUri]) => {
            console.log("@PREFIX " + prefixName + ": <" + prefixUri + "> .");
        });
    }

    getSchemaLiteral(object) {
        if (typeof object == "boolean") {
            return "\"" + object.toString() + "\"^^" + "<" + PREFIXES.xsd + "boolean>";
        }
        return "\"" + object + "\"";
    }

    getUserIri() {
        return "<" + this.getUserIriPart() + ">";
    }

}

let exporterTurtle = new ExporterTurtle();
exporterTurtle.exportOntology();
