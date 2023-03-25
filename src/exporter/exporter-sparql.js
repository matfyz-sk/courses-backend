import {GRAPH_IRI, ONTOLOGY_IRI, SPARQL_ENDPOINT} from "../constants";
import {Client, Data, Node, Triple} from "virtuoso-sparql-client";
import {Exporter, PREFIXES} from './exporter';
import chalk from "chalk";
import _ from "lodash";
import {dateTime, getNewNode} from "../helpers";


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

        try {
            await client.store(true);
            console.log(chalk.green(`[${dateTime()}] Export of the ontology finished successfully.`));
        } catch (e) {
            throw new Error(chalk.red(`[${dateTime()}] Export of the ontology was not successful. ` + e));
        }

        /* Adding admin must be called separately because otherwise the xsd type is wrongly set in the graph (for the boolean it is using nonNegativeInteger) causing issues in the UGQL. */
        const superAdminExists = await this.superAdminExists(client);
        if (!superAdminExists) {
            const userOntology = await this.getUserOntology();
            store.bulk(userOntology);

            try {
                await client.store(true);
                console.log(chalk.green(`[${dateTime()}] Export of the super admin settings was finished successfully.`));
            } catch (e) {
                throw new Error(chalk.red(`[${dateTime()}] Export of the super admin settings was not successful. ` + e));
            }
        }
    }

    async superAdminExists(client) {
        try {
            const r = await client.query("SELECT ?superAdmin WHERE {?superAdmin <" + ONTOLOGY_IRI + "isSuperAdmin> true}");
            return r && r.results && r.results.bindings && r.results.bindings.length > 0;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    getTriple(sprefix, s, pprefix, p, oprefix, o) {
        return new Triple(new Node(sprefix + s), new Node(pprefix + p), new Node(oprefix + o));
    }

    getUserTypeTriple(userIri) {
        return new Triple(userIri, new Node(PREFIXES.rdf + "type"), new Node(PREFIXES.courses + "User"));
    }

    getAdminTriple(userIri, fieldName, fieldValue) {
        return new Triple(userIri, new Node(PREFIXES.courses + fieldName), this.getSchemaLiteral(fieldValue));
    }

    getLiteralTriple(sprefix, s, pprefix, p, literalValue, literalType) {
        return new Triple(new Node(sprefix + s), new Node(pprefix + p), new Data(literalValue, literalType));
    }

    getPrefixes() {
        return PREFIXES;
    }

    getSchemaLiteral(object) {
        if (_.isBoolean(object)) {
            return new Data(object, 'xsd:boolean');
        }
        if (this.isFloat(object)) {
            return new Data(object, 'xsd:decimal'); /* In case of floats just return it as decimal */
        }
        if (_.isNumber(object)) {
            return new Data(object, 'xsd:integer');
        }
        if (_.isDate(object) || this.isIsoDate(object)) {
            return new Data(object, 'xsd:dateTime');
        }
        if (_.isString(object)) {
            return new Data(object, 'xsd:string');
        }
        return new Data(object);
    }

    getUserIri(userIriString) {
        return new Node(userIriString);
    }

    async createUserIriIdentifier() {
        const classPrefix = PREFIXES.coursesData + (PREFIXES.coursesData.lastIndexOf("/") === (PREFIXES.coursesData.length - 1) ? "" : "/") + "user/";
        return getNewNode(classPrefix);
    }

}
