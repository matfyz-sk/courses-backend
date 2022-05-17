import {Client, Data, Node, Text} from "virtuoso-sparql-client";
import * as ID from "../lib/virtuoso-uid";
import * as Resources from "../model";
import moment from "moment-timezone";
import RequestError from "./RequestError";
import jwt from "jsonwebtoken";
import {AUTH_SECRET, DATA_IRI, GRAPH_IRI, ONTOLOGY_IRI, SPARQL_ENDPOINT} from "../constants";
import _ from "lodash";

export function getTripleObjectType(objectTypeName, objectValue) {
    switch (objectTypeName) {
        case "node":
            return new Node(objectValue);
        case "integer":
            return new Data(objectValue, "xsd:integer");
        case "float":
            return new Data(objectValue, "xsd:float");
        case "boolean":
            return new Data(objectValue, "xsd:boolean");
        case "dateTime":
            return new Data(objectValue, "xsd:dateTimeStamp");
        case "string":
            return new Text(objectValue);
        default:
            throw new RequestError(`Invalid object type '${objectTypeName}'`, 500);
    }
}

export function getResourceObject(resourceName) {
    const r = changeFirstCharCase(resourceName, false);
    if (!Resources[r]) {
        throw new RequestError(`Resource with class name '${r}' is not supported`, 400);
    }
    return Resources[r];
}

export function getAllProps(resource, includeSubclasses = true) {
    let props = {};
    let r = resource;
    while (r) {
        Object.keys(r.props).forEach((key) => {
            props[key] = {...r.props[key]};
        });
        r = r.subclassOf;
    }

    if (
        !resource.hasOwnProperty("subclasses") ||
        !Array.isArray(resource.subclasses) ||
        !includeSubclasses
    ) {
        return props;
    }

    let subclasses = [...resource.subclasses];
    while (subclasses.length > 0) {
        const className = subclasses.shift();
        r = Resources[className];
        if (r) {
            Object.keys(r.props).forEach((key) => {
                props[key] = {...r.props[key]};
            });
            subclasses.concat(r.subclasses);
        }
    }

    return props;
}

export function getResourceCourseInstance(resource) {
    if (resource.hasOwnProperty("courseInstance")) {
        return resource.courseInstance;
    }
    let r = resource.subclassOf;
    while (r) {
        if (r.hasOwnProperty("courseInstance")) {
            return r.courseInstance;
        }
        r = r.subclassOf;
    }
    return null;
}

export function getResourceShowRules(resource) {
    if (resource.hasOwnProperty("show")) {
        return resource.show;
    }
    let r = resource.subclassOf;
    while (r) {
        if (r.hasOwnProperty("show")) {
            return r.show;
        }
        r = r.subclassOf;
    }
    return [];
}

export function getResourceCreateRules(resource) {
    if (resource.hasOwnProperty("create")) {
        return resource.create;
    }
    let r = resource.subclassOf;
    while (r) {
        if (r.hasOwnProperty("create")) {
            return r.create;
        }
        r = r.subclassOf;
    }
    return [];
}

export function client() {
    const client = new Client(SPARQL_ENDPOINT);
    client.setOptions(
        "application/json",
        {
            courses: ONTOLOGY_IRI,
        },
        GRAPH_IRI
    );
    return client;
}

export async function getNewNode(resourceURI) {
    ID.cfg({
        endpoint: SPARQL_ENDPOINT,
        graph: GRAPH_IRI,
        prefix: resourceURI,
    });
    let newNode;
    await ID.create()
        .then((commentIdTmp) => {
            newNode = new Node(commentIdTmp);
        })
        .catch(console.log);
    return newNode;
}

export function generateToken({userURI, email}) {
    return jwt.sign({userURI, email}, AUTH_SECRET, {algorithm: "HS256",});
}

export function classPrefix(className) {
    if (className.length !== 0) {
        const classNameFormatted = changeFirstCharCase(className, false);
        return DATA_IRI + "/" + classNameFormatted + "/";
    }
    return null;
}

export function changeFirstCharCase(className, toUpperCase) {
    if (!className || className.length < 1) {
        return className;
    }

    let upperCaseClassNameObject;

    if (_.isArray(className)) {
        upperCaseClassNameObject = className[0];
    } else if (_.isString(className)) {
        upperCaseClassNameObject = className;
    }

    if (upperCaseClassNameObject) {
        let firstChar = upperCaseClassNameObject.charAt(0);
        firstChar = toUpperCase ? firstChar.toUpperCase() : firstChar.toLowerCase();
        return firstChar + upperCaseClassNameObject.slice(1);
    }
    return null;
}

export function className(className, includePrefix = false) {
    let formattedClassName = changeFirstCharCase(className, true);

    if (formattedClassName) {
        return includePrefix ? "courses:" + formattedClassName : formattedClassName;
    }
    return null;
}

export function uri2className(uri) {
    //TODO check this
    return className([uri.substring(ONTOLOGY_IRI.length)]);
}

export function uri2id(uri) {
    return uri.substring(uri.lastIndexOf("/") + 1);
}

export function isIsoDate(str) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    let d = new Date(str);
    return d.toISOString() === str;
}

export function dateTime() {
    return moment().tz("Europe/Bratislava").format("DD-MM-YYYY HH:mm:ss");
}
