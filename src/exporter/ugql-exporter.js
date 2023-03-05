import {GRAPH_IRI, SPARQL_ENDPOINT} from "../constants";

export class UltraGraphQLExporter {

    getConfiguration() {
        return JSON.stringify({
            "name": "matfyz-graphql-config",
            "extraction": true,
            "mutations": true,
            "mutationService": "matfyz-graphql",
            "modelJson": "./src/ultragraphql/model.json",
            "server": {
                "port": 8543,
                "graphql": "/graphql",
                "graphiql": "/graphiql"
            },
            "services": [
                {
                    "id": "matfyz-graphql",
                    "type": "SPARQLEndpointService",
                    "url": SPARQL_ENDPOINT,
                    "graph": GRAPH_IRI,
                    "user": "SPARQL",
                    "password": "123456" //TODO adjust password
                }
            ],
            "prefixes": {
                "courses-data": "http://www.courses.matfyz.sk/data",
                "courses": "http://www.courses.matfyz.sk/ontology#",
                "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
                "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                "schema": "http://schema.org/",
                "owl": "http://www.w3.org/2002/07/owl#",
                "xsd": "http://www.w3.org/2001/XMLSchema#"
            }
        }, null, "\t");
    }
}