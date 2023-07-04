import {PREFIXES, SchemaExporter} from "./schema-exporter.js";
import {generate} from "../lib/virtuoso-uid";
import _ from "lodash";

/* npm install && npm install -g babel-cli
   npx babel-node src/exporter/turtle-schema-exporter.js */

const COLUMN_SIZE = 70;

export class TurtleSchemaExporter extends SchemaExporter {

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

    prettifyColumn(column) {
        if (COLUMN_SIZE - column?.length > 0) {
            return column + " ".repeat(COLUMN_SIZE - column.length);
        }
    }

    getTriple(sprefix, s, pprefix, p, oprefix, o) {
        return this.prettifyColumn(`<${sprefix}${s}>`) + " " + this.prettifyColumn(`<${pprefix}${p}>`) + " " + `<${oprefix}${o}> .`;
    }

    getUserTypeTriple(userIri) {
        return this.prettifyColumn(userIri) + " " + this.prettifyColumn(`<${PREFIXES.rdf}type>`) + `<${PREFIXES.courses}User> .`;
    }

    getAdminTriple(userIri, fieldName, fieldValue) {
        return this.prettifyColumn(userIri) + " " + this.prettifyColumn(`<${PREFIXES.courses}${fieldName}>`) + " " + this.getSchemaLiteral(fieldValue) + " .";
    }

    getLiteralTriple(sprefix, s, pprefix, p, literalValue, literalType) {
        return this.prettifyColumn(`<${sprefix}${s}>`) + " " + this.prettifyColumn(`<${pprefix}${p}>`) + " " + this.getFormattedLiteral(literalValue, literalType) + " .";
    }

    getFormattedLiteral(literalValue, literalType) {
        return `"${literalValue.toString()}"^^<${PREFIXES.xsd}${literalType}>`;
    }

    getPrefixes() {
        Object.entries(PREFIXES).map(([prefixName, prefixUri]) => {
            console.log(`@PREFIX ${prefixName}: <${prefixUri}> .`);
        });
    }

    getSchemaLiteral(object) {
        if (typeof object == "boolean") {
            return this.getScalarLiteral(object, "boolean");
        }
        if (this.isFloat(object)) {
            return this.getScalarLiteral(object, "decimal"); /* In case of floats just return it as decimal */
        }
        if (_.isNumber(object)) {
            return this.getScalarLiteral(object, "integer");
        }
        if (_.isDate(object) || this.isIsoDate(object)) {
            return this.getScalarLiteral(object, "dateTime");
        }
        if (_.isString(object)) {
            return this.getScalarLiteral(object, "string");
        }
        return `"${object.toString()}"`;
    }

    getScalarLiteral(object, scalarType) {
        return `"${object.toString()}"^^<${PREFIXES.xsd}${scalarType}>`;
    }

    getUserIri(userIriString) {
        return `<${userIriString}>`;
    }

    createUserIriIdentifier() {
        return PREFIXES.coursesData + (PREFIXES.coursesData.lastIndexOf("/") === (PREFIXES.coursesData.length - 1) ? "" : "/") + "user/" + generate();
    }

}

let exporterTurtle = new TurtleSchemaExporter();
exporterTurtle.exportOntology();
