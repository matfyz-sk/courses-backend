import lib from "sparql-transformer";
import { ontologyURI, virtuosoEndpoint, dcTermsURI } from "../constants";
import { getAllProps } from "../helpers";
import * as Resources from "../model";
import * as Predicates from "../constants/predicates";

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
    constructor(resource) {
        this.options = defaultOptions;
        this.sparqlTransformer = lib.default;
        this.resource = resource;
        this.props = getAllProps(resource);
        this.resourceURI = "?resourceURI";
        this.q = {
            "@graph": {},
            $where: [],
            $filter: []
        };
        this.setPrefixes(defaultPrefixes);
    }

    _build(val) {
        return val.prefix.name + ":" + val.value;
    }

    generateQuery(filters) {
        if (filters.id) {
            this.resourceURI = `<${this.resource.type.uriPrefix + filters.id}>`;
        }

        this.q["@graph"]["@id"] = this.resourceURI;

        if (this.resource.hasOwnProperty("subclasses")) {
            this.q["@graph"]["@type"] = "?type";
            this.pushWhere(`${this.resourceURI} ${this._build(Predicates.type)} ?type`);
            this.pushWhere(`?type rdfs:subClassOf* ${this._build(this.resource.type)}`);
        } else {
            this.q["@graph"]["@type"] = this.resource.type.value;
            this.pushWhere(`${this.resourceURI} ${this._build(Predicates.type)} ${this._build(this.resource.type)}`);
        }

        this.q["@graph"]["createdBy"] = "?createdBy";
        this.q["@graph"]["createAt"] = "?createdAt";
        this.pushWhere(`OPTIONAL {${this.resourceURI} courses:createdBy ?createdBy}`);
        this.pushWhere(`OPTIONAL {${this.resourceURI} dc:created ?createdAt}`);

        this.setOffset(filters._offset);
        this.setLimit(filters._limit);

        const joins =
            filters.hasOwnProperty("_join") && typeof filters._join == "string" ? filters._join.split(",").map(e => e.trim()) : [];

        Object.keys(this.props).forEach(predicateName => {
            var objectVar = `?${predicateName}`;
            if (this.props[predicateName].dataType === "node") {
                objectVar += "URI";
                this.q["@graph"][predicateName] = { "@id": objectVar };

                if (joins.includes(predicateName)) {
                    this.generatQueryPart(predicateName);
                }
                if (filters.hasOwnProperty(predicateName)) {
                    this.pushWhere(`${this.resourceURI} ${this._build(Predicates[predicateName])} ${objectVar}`);
                    const objectClass = Resources[this.props[predicateName].objectClass].type;
                    this.pushFilter(`${objectVar}=<${objectClass.uriPrefix + filters[predicateName]}>`);
                } else {
                    this.pushWhere(`OPTIONAL {${this.resourceURI} ${this._build(Predicates[predicateName])} ${objectVar}}`);
                }
                return;
            }
            this.q["@graph"][predicateName] = objectVar;
            if (filters.hasOwnProperty(predicateName)) {
                this.pushWhere(`${this.resourceURI} ${this._build(Predicates[predicateName])} ${objectVar}`);
                if (this.props[predicateName].dataType == "string") {
                    this.pushFilter(`${objectVar}="${filters[predicateName]}"`);
                } else {
                    this.pushFilter(`${objectVar}=${filters[predicateName]}`);
                }
            } else {
                this.pushWhere(`OPTIONAL {${this.resourceURI} ${this._build(Predicates[predicateName])} ${objectVar}}`);
            }
        });
        Object.keys(filters).forEach(predicateName => {
            if (
                predicateName === "id" ||
                predicateName === "_offset" ||
                predicateName === "_limit" ||
                predicateName === "_join" ||
                this.props.hasOwnProperty(predicateName)
            ) {
                return;
            }
            this.pushWhere(`<${filters[predicateName]}> ${this._build(Predicates[predicateName])} ${this.resourceURI}`);
        });
        console.log(this.q);
    }

    generatQueryPart(predicateName) {
        const resource = Resources[this.props[predicateName].objectClass];
        const resourceProps = getAllProps(resource);
        const queryPart = this.q["@graph"][predicateName];
        const partURI = queryPart["@id"];

        queryPart["@type"] = partURI + "type";
        queryPart["createdBy"] = partURI + "createdBy";
        queryPart["createdAt"] = partURI + "createdAt";

        var where = `OPTIONAL { ${this.resourceURI} ${this._build(
            Predicates[predicateName]
        )} ${partURI} . ${partURI} rdf:type ${partURI}type . ${partURI}type rdfs:subClassOf* ${this._build(
            resource.type
        )} . OPTIONAL {${partURI} courses:createdBy ${partURI}createdBy} . OPTIONAL {${partURI} dc:created ${partURI}createdAt} . `;

        Object.keys(resourceProps).forEach(p => {
            // if (resourceProps[p].dataType === "node") {
            //     const objectVar = partURI + p + "URI";
            //     queryPart[p] = { "@id": objectVar };
            //     where += `OPTIONAL {${partURI} ${this._build(Predicates[p])} ${objectVar}} . `;
            //     return;
            // }
            queryPart[p] = `${partURI + p}`;
            where += `OPTIONAL {${partURI} ${this._build(Predicates[p])} ${partURI + p}} . `;
        });

        where = where.substring(0, where.length - 2);
        where += "}";
        this.pushWhere(where);
    }

    pushWhere(where) {
        this.q.$where.push(where);
    }

    pushFilter(filter) {
        this.q.$filter.push(filter);
    }

    setPrefixes(prefixes) {
        this.q["$prefixes"] = prefixes;
    }

    setLimit(limit) {
        if (limit) this.q["$limit"] = limit;
    }

    setOffset(offset) {
        if (offset) this.q["$offset"] = offset;
    }

    setOrderBy(orderBy) {
        if (orderBy) this.q["$orderBy"] = orderBy;
    }

    run() {
        return this.sparqlTransformer(this.q, this.options);
    }
}

export default Query;
