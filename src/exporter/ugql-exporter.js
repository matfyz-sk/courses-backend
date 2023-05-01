import {DATA_IRI, GRAPH_IRI, ONTOLOGY_IRI, SPARQL_ENDPOINT} from "../constants";

export class UltraGraphQLConfigurationExporter {

    getConfiguration() {
        return JSON.stringify({
            "name": "matfyz-graphql-config",
            "extraction": true,
            "mutations": true,
            "mutationService": "matfyz-graphql",
            "modelJson": "./src/ultragraphql/model.json",
            "server": {
                "port": 8080,
                "graphql": "/graphql",
                "graphiql": "/graphiql"
            },
            "services": [
                {
                    "id": "matfyz-graphql",
                    "type": "SPARQLEndpointService",
                    "url": SPARQL_ENDPOINT,
                    "graph": GRAPH_IRI,
                    "user": "SPARQL"
                }
            ],
            "prefixes": {
                "courses-data": DATA_IRI, /* Key ("courses-data") is fixed and used in UltraGraphQL endpoint mutation. In case it needs to modified change it also in @see SPARQLMutationConverter. */
                "courses": ONTOLOGY_IRI, /* Key ("courses") is fixed and used in UltraGraphQL endpoint mutation. In case it needs to modified change it also in @see SPARQLMutationConverter. */
                "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
                "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                "schema": "http://schema.org/",
                "owl": "http://www.w3.org/2002/07/owl#",
                "xsd": "http://www.w3.org/2001/XMLSchema#"
            }
        }, null, "\t");
    }
}
