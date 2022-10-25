import { GRAPH_IRI, ONTOLOGY_IRI, SPARQL_ENDPOINT } from "../constants";
import { Client, Data, Node, Triple } from "virtuoso-sparql-client";
import { Exporter, PREFIXES } from './exporter';
import chalk from "chalk";
import {dateTime} from "../helpers";


export class ExporterSparql extends Exporter {

    async exportOntology() {
        const client = new Client(SPARQL_ENDPOINT);
        client.setOptions(
            "application/json",
            this.getPrefixes(),
            GRAPH_IRI
        );

        const store = client.getLocalStore();

        const commonOntology = this.getCommonOntology();
        store.bulk(commonOntology);

        const superAdminExists = await this.superAdminExists(client);
        if(!superAdminExists) {
            const userOntology = this.getUserOntology();
            store.bulk(userOntology);
        }

        try {
            await client.store(true);
        } catch(e) {
            console.log(e);
            console.log(chalk.red(`[${ dateTime() }]`), `Export of the ontology was not successful.`);
            return;
        }
        console.log(chalk.green(`[${ dateTime() }]`), `Export of the ontology finished successfully.`);
    }

    async superAdminExists(client) {
        try {
            const r = await client.query("SELECT ?superAdmin WHERE {?superAdmin <" + ONTOLOGY_IRI + "isSuperAdmin> true}");
            return r && r.results && r.results.bindings && r.results.bindings.length > 0;
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    getTriple(sprefix, s, pprefix, p, oprefix, o) {
        return new Triple(new Node(sprefix + s), new Node(pprefix + p), new Node(oprefix + o));
    }

    getUserTypeTriple() {
        return new Triple(this.getUserIri(), new Node(PREFIXES.rdf + "type"), new Node(PREFIXES.courses + "User"));
    }

    getAdminTriple(userIri, fieldName, fieldValue) {
        return new Triple(userIri, new Node(PREFIXES.courses + fieldName), this.getSchemaLiteral(fieldValue))
    }

    getPrefixes() {
        return PREFIXES;
    }

    getSchemaLiteral(object) {
        if(typeof object == "boolean") {
            return new Data(object, 'xsd:boolean');
        }
        return new Data(object);
    }

    getUserIri() {
        return new Node(this.getUserIriPart());
    }

}