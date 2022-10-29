export const AUTH_SECRET = process.env.AUTH_SECRET ?? "courses";
export const SPARQL_ENDPOINT = process.env.SPARQL_ENDPOINT ?? "http://127.0.0.1:8890/sparql";
export const DC_TERMS_IRI = "http://purl.org/dc/terms/";
export const BASE_IRI = process.env.BASE_IRI ?? "http://www.testing.courses.matfyz.sk/";
export const GRAPH_IRI = process.env.GRAPH_IRI ?? BASE_IRI;
export const ONTOLOGY_IRI = BASE_IRI + "ontology#";
export const DATA_IRI = BASE_IRI + "data";
export const IMPERSONATION_PASSWORD = process.env.IMPERSONATION_PASSWORD;
