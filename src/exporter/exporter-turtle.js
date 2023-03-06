import {Exporter, PREFIXES} from "./exporter";
import {generate} from "../lib/virtuoso-uid";

//npm install && npm install -g babel-cli
//npx babel-node src/exporter/exporter-turtle.js

export class ExporterTurtle extends Exporter {

    async exportOntology() {
        this.getPrefixes();
        console.log("");

        const commonOntology = this.getCommonOntology();

        commonOntology.map((item) => {
                console.log(item);
            }
        );
        console.log("");

        const userOntology = await this.getUserOntology();

        userOntology.map((item) => {
                console.log(item);
            }
        );
    }

    getTriple(sprefix, s, pprefix, p, oprefix, o) {
        return sprefix + s + " " + pprefix + p + " " + oprefix + o + " .";
    }

    getUserTypeTriple(userIri) {
        return userIri + " " + PREFIXES.rdf + "type" + " " + PREFIXES.courses + "User" + " .";
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

    getUserIri(userIriString) {
        return "<" + userIriString + ">";
    }

    createUserIriIdentifier() {
        return PREFIXES.coursesData + (PREFIXES.coursesData.lastIndexOf("/") === (PREFIXES.coursesData.length - 1) ? "" : "/") + "user/" + generate();
    }

}

let exporterTurtle = new ExporterTurtle();
exporterTurtle.exportOntology();
