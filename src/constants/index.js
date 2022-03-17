export const AUTH_SECRET = process.env.AUTH_SECRET ? process.env.AUTH_SECRET : "courses";
export const SPARQL_ENDPOINT = process.env.SPARQL_ENDPOINT ? process.env.SPARQL_ENDPOINT : "http://matfyz.sk:8890/sparql";
export const DC_TERMS_URI = "http://purl.org/dc/terms/";
export const DEFAULT_URI = process.env.DEFAULT_URI ? process.env.DEFAULT_URI : "http://www.courses.matfyz.sk/";
export const ONTOLOGY_URI = DEFAULT_URI + "ontology#";
export const DATA_URI = DEFAULT_URI + "data";
export const GRAPH_URI = process.env.GRAPH_URI ? process.env.GRAPH_URI : DEFAULT_URI;
