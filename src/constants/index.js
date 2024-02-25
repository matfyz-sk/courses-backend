export const AUTH_SECRET = process.env.AUTH_SECRET ?? "courses";
export const SPARQL_ENDPOINT = process.env.SPARQL_ENDPOINT ?? "http://127.0.0.1:8890/sparql";
export const SPARQL_USER = process.env.SPARQL_USER ?? "SPARQL";
export const SPARQL_PASSWORD = process.env.SPARQL_PASSWORD ?? "123456";
export const BASE_IRI = process.env.BASE_IRI ?? "http://www.courses.matfyz.sk/";
export const GRAPH_IRI = process.env.GRAPH_IRI ?? BASE_IRI;
export const VIRTUOSO_JDBC_PORT = process.env.VIRTUOSO_JDBC_PORT ?? "1111"; /* Needed for the VirtGraph in UGQL used for transaction calls https://docs.openlinksw.com/virtuoso/jdbcurl4mat/ */
export const ONTOLOGY_IRI = BASE_IRI + "ontology#";
export const ONTOLOGY_VERSION = "0.1.0";
export const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME ?? "Admin";
export const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL ?? "spravca@matfyz.sk";
export const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD ?? "admin123";
export const PASSWORD_SALT = 10;
export const DATA_IRI = BASE_IRI + "data";
export const IMPERSONATION_PASSWORD = process.env.IMPERSONATION_PASSWORD;
export const DEBUG_QUERIES = process.env.DEBUG_QUERIES ?? true;
