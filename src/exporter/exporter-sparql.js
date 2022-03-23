import { GRAPH_IRI, DATA_IRI, SPARQL_ENDPOINT } from "../constants";
import { Client, Data, Node, Triple } from "virtuoso-sparql-client";
import { Exporter, PREFIXES } from './exporter';


export class ExporterSparql extends Exporter {

    exportOntology() {
        const client = new Client(SPARQL_ENDPOINT);
        client.setOptions(
            "application/json",
            this.getPrefixes(),
            GRAPH_IRI
        );

        let store = client.getLocalStore();

        let commonOntology = this.getCommonOntology();
        store.bulk(commonOntology);

        let userOntology = this.getUserOntology();
        store.bulk(userOntology);

        client.store(true)
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err);
            });
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