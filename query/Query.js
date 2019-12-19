import lib from "sparql-transformer";
import { ontologyURI, virtuosoEndpoint, dcTermsURI } from "../constants";

const defaultOptions = {
    context: "http://www.courses.matfyz.sk/ontology#",
    endpoint: virtuosoEndpoint,
    debug: true
};

const defaultPrefixes = {
    courses: ontologyURI,
    dc: dcTermsURI
};

class Query {
    constructor(options = defaultOptions) {
        this.q = {};
        this.options = options;
        this.sparqlTransformer = lib.default;
        this.setPrefixes(defaultPrefixes);
    }

    setProto(proto) {
        this.q["@graph"] = proto;
    }

    setWhere(where) {
        this.q["$where"] = where;
    }

    appendWhere(where) {
        if (this.q.$where == null) this.q["$where"] = [];
        this.q.$where.push(where);
    }

    setFilter(filter) {
        this.q["$filter"] = filter;
    }

    setPrefixes(prefixes) {
        this.q["$prefixes"] = prefixes;
    }

    setLimit(limit) {
        this.q["$limit"] = limit;
    }

    setOffset(offset) {
        this.q["$offset"] = offset;
    }

    setOrderBy(orderBy) {
        this.q["$orderBy"] = orderBy;
    }

    run() {
        return this.sparqlTransformer(this.q, this.options);
    }

    prepare() {
        this.q = {};
    }

    setOptions(options) {
        this.options = options;
    }
}

export default Query;
