import * as models from "../model/index.js";
import bcrypt from "bcrypt";
import { GRAPH_URI, VIRTUOSO_ENDPOINT } from "../constants";
import { Client, Data, Node, Triple } from "virtuoso-sparql-client";

const PREFIXES = {
    courses: "http://www.courses.matfyz.sk/ontology#",
    coursesData: "http://www.courses.matfyz.sk/data",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    schema: "http://schema.org/",
    owl: "http://www.w3.org/2002/07/owl#",
    xsd: "http://www.w3.org/2001/XMLSchema#"
};

function getAdminSettings() {
    const PASSWORD = "admin123";
    const NAME = "Admin";
    const hash = bcrypt.hashSync(PASSWORD, 10);

    return {
        firstName: NAME,
        lastName: NAME,
        email: "admin@admin.admin",
        password: hash,
        description: "",
        nickname: NAME,
        useNickName: true,
        publicProfile: false,
        showCourses: false,
        showBadges: false,
        allowContact: false,
        nickNameTeamException: true,
        isSuperAdmin: true,
        identifier: "s3MzY"
    }
}

const RDFS_TYPE = new Node(PREFIXES.rdf + "type");

export function exportOntology() {
    const client = new Client(VIRTUOSO_ENDPOINT);
    client.setOptions(
        "application/json",
        PREFIXES,
        GRAPH_URI
    );

    let store = client.getLocalStore();

    Object.values(models).map((model) => {
        let className;
        if(model.type) {
            className = firstLetterToUppercase(model.type);
            store.add(new Triple(new Node(PREFIXES.courses + className), RDFS_TYPE, new Node(PREFIXES.rdfs + "Class")));
        }
        if(model.subclassOf && model.subclassOf.type) {
            store.add(new Triple(new Node(PREFIXES.courses + className), new Node(PREFIXES.rdfs + "subClassOf"), new Node(PREFIXES.courses + firstLetterToUppercase(model.subclassOf.type))));
        }

        if(model.subclasses) {
            for(let subclass of model.subclasses) {
                store.add(new Triple(new Node(PREFIXES.courses + firstLetterToUppercase(subclass)), new Node(PREFIXES.rdfs + "subClassOf"), new Node(PREFIXES.courses + ":" + className)));
            }
        }
        if(model.props) {
            Object.entries(model.props).map(([ propertyName, propertyObject ]) => {
                store.add(new Triple(new Node(PREFIXES.courses + propertyName), new Node(PREFIXES.schema + "domainIncludes"), new Node(PREFIXES.courses + className)));

                if(propertyObject) {
                    if(propertyObject.objectClass) {
                        store.add(new Triple(new Node(PREFIXES.courses + propertyName), new Node(PREFIXES.schema + "rangeIncludes"), new Node(PREFIXES.courses + firstLetterToUppercase(propertyObject.objectClass))));
                    }
                    if(propertyObject.dataType) {
                        store.add(new Triple(new Node(PREFIXES.courses + propertyName), RDFS_TYPE, new Node(PREFIXES.owl + getTypeOfProperty(propertyObject.dataType))));
                    }
                }
            });
        }
    });

    let adminSettings = getAdminSettings();
    let userIri = new Node(PREFIXES.coursesData + (PREFIXES.coursesData.lastIndexOf("/") === (PREFIXES.coursesData.length - 1) ? "" : "/") + "user/" + adminSettings.identifier);

    store.add(new Triple(userIri, RDFS_TYPE, new Node(PREFIXES.courses + "User")));

    Object.entries(adminSettings).map(([ fieldName, fieldValue ]) => {
        store.add(new Triple(userIri, new Node(PREFIXES.courses + fieldName), getSchemaLiteral(fieldValue)));
    })

    client.store(true)
        .then((result) => {
            console.log(result)
        })
        .catch((err) => {
            console.log(err);
        });
}

function getSchemaLiteral(object) {
    if(typeof object == "boolean") {
        return new Data(object, 'xsd:boolean');
    }
    return new Data(object);
}

function firstLetterToUppercase(value) {
    return value && value.length > 0 ? (value[0].toUpperCase() + value.slice(1)) : value;
}

//string, datetime, boolean, float, integer, node
function getTypeOfProperty(dataType) {
    if(dataType === "node") {
        return "ObjectProperty";
    }
    return "DatatypeProperty";
}