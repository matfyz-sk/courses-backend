import { Triple, Node } from "virtuoso-sparql-client";
import {
   getNewNode,
   getAllProps,
   getTripleObjectType,
   classPrefix,
   className,
   client,
   getResourceObject,
   getResourceCreateRules,
} from "../helpers";
import * as Constants from "../constants";
import RequestError from "../helpers/RequestError";

export default class Resource {
   constructor(cfg) {
      this.resource = cfg.resource;
      this.user = cfg.user;
      this.id = cfg.id;
      this.parent = cfg.parent;
      this.setCreator = cfg.setCreator == undefined || cfg.setCreator == true ? true : false;
      this._setSubject();
      this.triples = { toAdd: [], toUpdate: [], toRemove: [] };
      this.db = client();
      this.removeOld = true;
      this.props = getAllProps(cfg.resource, false);
      this.nested = [];
   }

   setResourceObject(_res) {
      this.resource = _res;
      this.props = getAllProps(_res, false);
   }

   async _getResourceCourseInstance() {
      if (this.props.hasOwnProperty("courseInstance")) {
         return this.props.courseInstance.value.obj.iri;
      }
      var r = this.resource.subclassOf;
      while (r) {
         if (r.hasOwnProperty("courseInstance")) {
            var path = r.courseInstance;
            var propName = path.substring(0, path.indexOf("/"));

            var subject = `<${this.props[propName].value.obj.iri}>`;
            var predicate = path.substring(path.indexOf("/") + 1);
            var object = `?courseInstanceURI`;

            const data = await this.db.query(`
               SELECT ${object} WHERE {
                  ${subject} ${predicate} ${object}
               }
            `);
            if (data.results.bindings.length === 1) {
               return data.results.bindings[0];
            }
         }
         r = r.subclassOf;
      }
      return null;
   }

   async authorizeCreate() {
      const createRules = getResourceCreateRules(this.resource);
      var res;
      var authorized = false;
      for (let rule of createRules) {
         res = await this._resolveCreateAuthRule(rule);
         if (res) {
            authorized = true;
            break;
         }
      }
      if (!authorized) {
         throw new RequestError(`You can't create resource '${this.resource.type}'`, 401);
      }
      for (var nestedInstance of this.nested) {
         await nestedInstance.authorizeCreate();
      }
      return true;
   }

   _setSubject() {
      if (this.id != undefined) {
         this.subject = new Node(classPrefix(this.resource.type) + this.id);
      } else {
         this.subject = undefined;
      }
   }

   async setInputPredicates(data) {
      for (let predicateName of Object.keys(this.props)) {
         await this.setPredicate(predicateName, data[predicateName]);
      }
   }

   async setPredicate(predicateName, value) {
      if (!this.props.hasOwnProperty(predicateName)) {
         return;
      }
      if (value == undefined) {
         if (this.props[predicateName].required) {
            throw new RequestError(`Attribute '${predicateName}' is required`, 422);
         }
         return;
      }
      if (!this.props[predicateName].multiple) {
         if (Array.isArray(value)) {
            if (value.length > 1) {
               throw new RequestError(`Attribute '${predicateName}' accepts only one value`, 422);
            }
            value = value[0];
         }
         await this._setProperty(predicateName, value);
      } else {
         await this._setArrayProperty(predicateName, value);
      }
   }

   async setPredicateToDelete(predicateName, value) {
      if (!this.props.hasOwnProperty(predicateName) || !this.props[predicateName].value) {
         return;
      }
      if (!this.props[predicateName].multiple) {
         // delete single predicate value
         if (this.props[predicateName].required) {
            throw new RequestError(`You can't delete attribute '${predicateName}'`, 422);
         }
         this.props[predicateName].value.setOperation(Triple.REMOVE);
         return;
      }
      if (!value) {
         // delete all values of predicate
         for (var triple of this.props[predicateName].value) {
            triple.setOperation(Triple.REMOVE);
         }
         return;
      }
      if (!Array.isArray(value)) {
         value = [value];
      }
      for (var v of value) {
         for (var triple of this.props[predicateName].value) {
            if (
               (triple.obj.hasOwnProperty("iri") && triple.obj.iri == v) ||
               (triple.obj.hasOwnProperty("value") && triple.obj.value == v)
            ) {
               triple.setOperation(Triple.REMOVE);
            }
         }
      }
   }

   async _prepareProperties() {
      if (this.subject == undefined) {
         this.subject = await getNewNode(classPrefix(this.resource.type));
         this.props.type = {
            value: new Triple(this.subject, "rdf:type", className(this.resource.type, true)),
         };
         if (this.setCreator) {
            this.props.createdBy = {
               value: new Triple(this.subject, "courses:createdBy", new Node(this.user.userURI)),
            };
         }
      }

      for (let predicateName of Object.keys(this.props)) {
         const value = this.props[predicateName].value;
         if (!value) {
            if (this.props[predicateName].required) {
               throw new RequestError(`Attribute '${predicateName}' is required`, 422);
            }
            continue;
         }
         if (Array.isArray(value)) {
            for (let val of value) {
               await this._arrangeTriple(predicateName, val);
            }
            continue;
         }
         await this._arrangeTriple(predicateName, value);
      }
   }

   async _arrangeTriple(predicateName, triple) {
      if (triple instanceof Resource) {
         await triple._prepareProperties();
         this.triples.toAdd = this.triples.toAdd.concat(triple.triples.toAdd);
         this.triples.toAdd.push(
            new Triple(this.subject, `courses:${predicateName}`, triple.subject)
         );
         return;
      }

      if (triple.getOperation() == Triple.ADD) {
         triple.subj = this.subject;
         this.triples.toAdd.push(triple);
         return;
      }
      if (triple.getOperation() == Triple.UPDATE) {
         this.triples.toUpdate.push(triple);
         return;
      }
      if (triple.getOperation() == Triple.REMOVE) {
         this.triples.toRemove.push(triple);
         return;
      }
   }

   async _resolveCreateAuthRule(rule) {
      if (rule.length == 0) {
         return true;
      }
      var courseInstance = await this._getResourceCourseInstance();

      if (
         (rule === "teacher" || rule === "student" || rule === "admin") &&
         courseInstance == null
      ) {
         throw new RequestError("Bad class configuration");
      }

      if (rule === "student") {
         const data = await this.db.query(
            `ASK { <${this.user.userURI}> courses:studentOf <${courseInstance}> }`
         );
         return data.boolean;
      }

      if (rule === "teacher") {
         const data = await this.db.query(
            `ASK { <${courseInstance}> courses:hasInstructor <${this.user.userURI}> }`
         );

         return data.boolean;
      }

      if (rule === "admin") {
         const data = await this.db.query(
            `ASK { <${courseInstance}> courses:instanceOf/courses:hasAdmin <${this.user.userURI}> }`
         );
         return data.boolean;
      }

      if (rule === "superAdmin") {
         const data = await this.db.query(
            `ASK { <${this.user.userURI}> courses:isSuperAdmin true }`
         );
         return data.boolean;
      }

      if (rule.startsWith("[") && rule.endsWith("]")) {
         rule = rule.substring(1, rule.length - 1);
         if (this.parent == undefined || this.parent.resource.type !== rule) {
            return false;
         }
         return true;
      }

      var propName = rule.substring(0, rule.indexOf("/"));

      var subject = `<${this.props[propName].value.obj.iri}>`;
      var predicate = rule.substring(rule.indexOf("/") + 1);
      const regex = /([a-zA-Z]+)/gm;
      predicate = predicate.replace(regex, "courses:$1");
      var object = `<${this.user.userURI}>`;

      const data = await this.db.query(`ASK { ${subject} ${predicate} ${object}}`);
      return data.boolean;
   }

   async _resourceExists(resourceURI, resourceClass) {
      const data = await this.db.query(
         `ASK { <${resourceURI}> rdf:type ?type . ?type rdfs:subClassOf* ${className(
            resourceClass,
            true
         )} }`
      );
      return data.boolean;
   }

   async _setNestedProperty(propName, nestedValue) {
      let resource = getResourceObject(this.props[propName].objectClass);
      if (resource.subclasses != undefined) {
         if (!nestedValue.hasOwnProperty("_type")) {
            throw new RequestError("You must specify attribute _type in nested object", 400);
         }
         resource = getResourceObject(nestedValue._type);
      }
      const r = new Resource({ resource, user: this.user, parent: this });
      await r.setInputPredicates(nestedValue);
      if (Array.isArray(this.props[propName].value)) {
         this.props[propName].value.push(r);
      } else {
         this.props[propName].value = r;
      }
      this.nested.push(r);
   }

   async _setProperty(propName, propValue) {
      if (this.props[propName].dataType === "node") {
         if (propValue.constructor.name == "Object") {
            await this._setNestedProperty(propName, propValue);
            return;
         }
         if (propValue.constructor.name != "String") {
            throw new RequestError(`Invalid value for attribute '${propName}'`, 400);
         }
         if (!(await this._resourceExists(propValue, this.props[propName].objectClass))) {
            throw new RequestError(`Resource with URI ${propValue} doesn't exist`, 400);
         }
      }
      const object = getTripleObjectType(this.props[propName].dataType, propValue);
      if (!this.props[propName].value) {
         this.props[propName].value = new Triple(this.subject, `courses:${propName}`, object);
      } else {
         this.props[propName].value.setOperation(Triple.ADD);
         this.props[propName].value.updateObject(object);
      }
   }

   async _setArrayProperty(propName, propValue) {
      if (this.props[propName].value && this.removeOld) {
         for (let triple of this.props[propName].value) {
            triple.setOperation(Triple.REMOVE);
         }
      }
      if (!this.props[propName].hasOwnProperty("value")) {
         this.props[propName].value = [];
      }
      const propDataType = this.props[propName].dataType;
      for (let value of propValue) {
         if (propDataType === "node") {
            if (value.constructor.name == "Object") {
               await this._setNestedProperty(propName, value);
               continue;
            }
            if (value.constructor.name != "String") {
               throw new RequestError(`Invalid value for attribute '${propName}'`, 400);
            }
            if (!(await this._resourceExists(value, this.props[propName].objectClass))) {
               throw new RequestError(`Resource with URI ${value} doesn't exist`, 400);
            }
         }
         this.props[propName].value.push(
            new Triple(
               this.subject,
               `courses:${propName}`,
               getTripleObjectType(propDataType, value)
            )
         );
      }
   }

   _setNewProperty(predicate, objectValue) {
      const object = getTripleObjectType(this.props[predicate].dataType, objectValue);
      this.props[predicate].value = new Triple(
         this.subject,
         `courses:${predicate}`,
         object,
         "nothing"
      );
   }

   _setNewArrayProperty(predicate, objectValue) {
      this.props[predicate].value = [];
      if (!objectValue) return;
      for (let value of objectValue) {
         const object = getTripleObjectType(this.props[predicate].dataType, value);
         this.props[predicate].value.push(
            new Triple(this.subject, `courses:${predicate}`, object, "nothing")
         );
      }
   }

   async store(post = true) {
      await this._prepareProperties(post);

      if (this.triples.toRemove.length > 0) {
         this.db.getLocalStore().empty();
         this.db.getLocalStore().bulk(this.triples.toRemove);
         await this.db.store(true);
      }

      if (this.triples.toAdd.length > 0) {
         this.db.getLocalStore().empty();
         this.db.getLocalStore().bulk(this.triples.toAdd);
         await this.db.store(true);
      }

      if (this.triples.toUpdate.length > 0) {
         this.db.getLocalStore().empty();
         this.db.getLocalStore().bulk(this.triples.toUpdate);
         await this.db.store(true);
      }
   }

   async completeDelete() {
      await this.db.query(`DELETE WHERE {<${this.subject.iri}> ?p ?o}`, true);
      await this.db.query(`DELETE WHERE {?s ?p <${this.subject.iri}>}`, true);
   }

   async fetch() {
      const data = await this.db.query(
         `SELECT ?s ?p ?o 
          WHERE { ?s ?p ?o } 
          VALUES ?s { <${this.subject.iri}> }`
      );
      if (data.results.bindings.length == 0) {
         throw new RequestError(`Resource with URI ${this.subject.iri} doesn't exist`, 404);
      }
      this._fill(data.results.bindings);
   }

   _prepareData(data) {
      var actualData = {};
      for (var row of data) {
         var predicate = row.p.value;
         const object = row.o.value;
         const lastSharpIndex = predicate.lastIndexOf("#");
         const lastDashIndex = predicate.lastIndexOf("/");
         if (lastSharpIndex > lastDashIndex) {
            predicate = predicate.substring(lastSharpIndex + 1);
         } else {
            predicate = predicate.substring(lastDashIndex + 1);
         }
         if (actualData[predicate]) {
            if (Array.isArray(actualData[predicate])) {
               actualData[predicate].push(object);
            } else {
               actualData[predicate] = [actualData[predicate], object];
            }
            continue;
         }
         actualData[predicate] = object;
      }
      return actualData;
   }

   _fill(data) {
      data = this._prepareData(data);
      Object.keys(this.props).forEach((predicateName) => {
         if (
            predicateName == "type" ||
            predicateName == "createdBy" ||
            predicateName == "createdAt"
         ) {
            return;
         }
         if (data.hasOwnProperty(predicateName)) {
            if (this.props[predicateName].multiple) {
               if (!Array.isArray(data[predicateName])) {
                  data[predicateName] = [data[predicateName]];
               }
               this._setNewArrayProperty(predicateName, data[predicateName]);
            } else {
               this._setNewProperty(predicateName, data[predicateName]);
            }
         }
      });
   }
}
