import * as Constants from "../constants";
import { Client, Node, Data, Text } from "virtuoso-sparql-client";
import * as ID from "../lib/virtuoso-uid";
import * as Resources from "../model";
import moment from "moment-timezone";
import RequestError from "./RequestError";
import jwt from "jsonwebtoken";

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
   resourceName = resourceName.charAt(0).toLowerCase() + resourceName.slice(1);
   if (!Resources[resourceName]) {
      throw new RequestError(`Resource with class name '${resourceName}' is not supported`, 400);
   }
   return Resources[resourceName];
}

export function getAllProps(resource, includeSubclasses = true) {
   var props = {};
   var r = resource;
   while (r) {
      Object.keys(r.props).forEach((key) => {
         props[key] = { ...r.props[key] };
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

   var subclasses = [...resource.subclasses];
   while (subclasses.length > 0) {
      const className = subclasses.shift();
      r = Resources[className];
      if (r) {
         Object.keys(r.props).forEach((key) => {
            props[key] = { ...r.props[key] };
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
   var r = resource.subclassOf;
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
   var r = resource.subclassOf;
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
   var r = resource.subclassOf;
   while (r) {
      if (r.hasOwnProperty("create")) {
         return r.create;
      }
      r = r.subclassOf;
   }
   return [];
}

export function client() {
   const client = new Client(Constants.VIRTUOSO_ENDPOINT);
   client.setOptions(
      "application/json",
      {
         courses: Constants.ONTOLOGY_URI,
      },
      Constants.GRAPH_URI
   );
   return client;
}

export async function getNewNode(resourceURI) {
   ID.cfg({
      endpoint: Constants.VIRTUOSO_ENDPOINT,
      graph: Constants.GRAPH_URI,
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

export function generateToken({ userURI, email }) {
   let token = jwt.sign({ userURI, email }, Constants.AUTH_SECRET, {
      algorithm: "HS256",
   });
   return token;
}

export function classPrefix(className) {
   const lowerCaseClassName = className.charAt(0).toLowerCase() + className.slice(1);
   return Constants.GRAPH_URI + "/" + lowerCaseClassName + "/";
}

export function className(className, includePrefix = false) {
   const upperCaseClassName = className.charAt(0).toUpperCase() + className.slice(1);
   return includePrefix ? "courses:" + upperCaseClassName : upperCaseClassName;
}

export function uri2className(uri) {
   return className(uri.substring(Constants.ONTOLOGY_URI.length));
}

export function uri2id(uri) {
   return uri.substring(uri.lastIndexOf("/") + 1);
}

export function isIsoDate(str) {
   if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
   var d = new Date(str);
   return d.toISOString() === str;
}

export function dateTime() {
   return moment().tz("Europe/Bratislava").format("DD-MM-YYYY HH:mm:ss");
}
