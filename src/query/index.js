import lib from "sparql-transformer";
import { ontologyURI, virtuosoEndpoint, dcTermsURI } from "../constants";
import {
   getAllProps,
   classPrefix,
   className,
   getResourceCourseInstance,
   getResourceShowRules,
   getResourceObject,
} from "../helpers";
import RequestError from "../helpers/RequestError";

const sparqlOptions = {
   context: ontologyURI,
   endpoint: virtuosoEndpoint,
   debug: false,
};

const sparqlPrefixes = {
   courses: ontologyURI,
   dc: dcTermsURI,
};

function generateQuery(resource, filters, user) {
   var query = {
      "@graph": {},
      $where: [],
      $filter: [],
      $prefixes: sparqlPrefixes,
   };

   const allProps = getAllProps(resource);
   allProps["createdBy"] = {
      required: true,
      multiple: false,
      dataType: "node",
      objectClass: "user",
   };

   var id = filters.id ? `<${classPrefix(resource.type) + filters.id}>` : "?id";
   query["@graph"]["@id"] = filters.id ? `${classPrefix(resource.type) + filters.id}` : "?id";

   query["@graph"]["@type"] = "?type";
   query.$where.push(`${id} rdf:type ?type`);
   query.$where.push(`?type rdfs:subClassOf* ${className(resource.type, true)}`);

   query["@graph"]["createdAt"] = "?createdAt";
   query.$where.push(`OPTIONAL { ${id} dc:created ?createdAt }`);

   if (filters._orderBy) {
      query.$orderby = [`?${filters._orderBy}`];
   }

   const joins =
      filters.hasOwnProperty("_join") && typeof filters._join == "string"
         ? filters._join.split(",").map((e) => e.trim())
         : [];

   Object.keys(allProps).forEach((predicateName) => {
      var objectVar = `?${predicateName}`;
      if (allProps[predicateName].dataType === "node") {
         objectVar += "URI";
         query["@graph"][predicateName] = { "@id": objectVar };
         var where = `OPTIONAL { ${id} courses:${predicateName} ${objectVar} . `;

         if (joins.includes(predicateName)) {
            const joinResource = getResourceObject(allProps[predicateName].objectClass);
            const joinResourceProps = getAllProps(joinResource);
            query["@graph"][predicateName]["@type"] = `${objectVar}type`;
            query["@graph"][predicateName]["createdBy"] = `${objectVar}createdBy`;
            query["@graph"][predicateName]["createdAt"] = `${objectVar}createdAt`;

            where += `${objectVar} rdf:type ${objectVar}type . ${objectVar}type rdfs:subClassOf* ${className(
               joinResource.type,
               true
            )} . OPTIONAL {${objectVar} courses:createdBy ${objectVar}createdBy} . OPTIONAL {${objectVar} dc:created ${objectVar}createdAt} . `;

            Object.keys(joinResourceProps).forEach((joinPredicate) => {
               query["@graph"][predicateName][joinPredicate] = `${objectVar + joinPredicate}`;
               where += `OPTIONAL {${objectVar} courses:${joinPredicate} ${
                  objectVar + joinPredicate
               }} . `;
            });

            var authWhere = resolveAuthRules(objectVar, joinResource, joinResourceProps, user);
            if (authWhere.length > 0) {
               where += authWhere + " . ";
            }
         }

         where = where.substring(0, where.length - 2) + "}";
         query.$where.push(where);

         if (filters.hasOwnProperty(predicateName)) {
            query.$where.push(
               `FILTER EXISTS { ${id} courses:${predicateName} <${
                  classPrefix(allProps[predicateName].objectClass) + filters[predicateName]
               }> }`
            );
         }
         return;
      }
      query["@graph"][predicateName] = objectVar;
      if (filters.hasOwnProperty(predicateName)) {
         query.$where.push(`${id} courses:${predicateName} ${objectVar}`);
         if (allProps[predicateName].dataType == "string") {
            query.$filter.push(`${objectVar}="${filters[predicateName]}"`);
         } else {
            query.$filter.push(`${objectVar}=${filters[predicateName]}`);
         }
      } else {
         query.$where.push(`OPTIONAL { ${id} courses:${predicateName} ${objectVar} }`);
      }
   });
   Object.keys(filters).forEach((predicateName) => {
      if (
         predicateName === "id" ||
         predicateName === "_orderBy" ||
         predicateName === "_join" ||
         predicateName === "_chain" ||
         allProps.hasOwnProperty(predicateName)
      ) {
         return;
      }
      query.$where.push(`${id} ^courses:${predicateName} ?${predicateName}URI`);
      query.$filter.push(`regex (?${predicateName}URI, "${filters[predicateName]}$")`);
   });
   const authWhere = resolveAuthRules(id, resource, allProps, user);
   if (authWhere.length > 0) {
      query.$where.push(authWhere);
   }
   return query;
}

function resolveAuthRules(id, resource, props, user) {
   if (user != undefined && user.isSuperAdmin) {
      return "";
   }
   var rules = getResourceShowRules(resource);
   var courseInstance = props.courseInstance
      ? "courseInstance"
      : getResourceCourseInstance(resource);

   var predicate = "";

   if (courseInstance == null) {
      return "";
   }
   if (rules.length == 1 && rules[0] == "all") {
      return "";
   }
   if (user == undefined) {
      throw new RequestError("You don't have access rights to this resource", 401);
   }
   if (rules.length == 0) {
      // default rules
      predicate = `createdBy | ${courseInstance}/hasInstructor | ${courseInstance}/^studentOf | ${courseInstance}/instanceOf/hasAdmin`;
      const regex = /([a-zA-Z]+)/gm;
      predicate = predicate.replace(regex, "courses:$1");
      return `${id} ${predicate} <${user.userURI}>`;
   }
   for (let rule of rules) {
      if (rule === "teacher") {
         if (courseInstance == null) {
            throw new RequestError("Bad class configuration");
         }
         predicate += `${courseInstance}/hasInstructor|`;
         continue;
      }
      if (rule === "student") {
         if (courseInstance == null) {
            throw new RequestError("Bad class configuration");
         }
         predicate += `${courseInstance}/^studentOf|`;
         continue;
      }
      if (rule === "creator") {
         predicate += `createdBy|`;
         continue;
      }
      if (rule === "admin") {
         if (courseInstance == null) {
            throw new RequestError("Bad class configuration");
         }
         predicate += `${courseInstance}/instanceOf/hasAdmin|`;
         continue;
      }
      // special defined rule
      predicate += `${rule}|`;
   }
   if (predicate.length > 0) {
      predicate = predicate.substring(0, predicate.length - 1);
      const regex = /([a-zA-Z]+)/gm;
      predicate = predicate.replace(regex, "courses:$1");
      return `${id} ${predicate} <${user.userURI}>`;
   }
   return "";
}

function nodesToArray(obj) {
   if (obj.constructor.name == "Array") {
      for (var val of obj) {
         nodesToArray(val);
      }
      return;
   }
   for (var predicateName in obj) {
      if (obj.hasOwnProperty(predicateName)) {
         if (obj[predicateName].constructor.name != "Object") {
            continue;
         }
         if (predicateName === "createdBy") {
            continue;
         }
         if (Object.keys(obj[predicateName]).length == 0) {
            obj[predicateName] = [];
         } else {
            nodesToArray(obj[predicateName]);
            obj[predicateName] = [obj[predicateName]];
         }
      }
   }
}

async function run(query) {
   const data = await lib.default(query, sparqlOptions);
   nodesToArray(data["@graph"]);
   return data;
}

async function dataChain(query, propName) {
   var res = await run({ ...query });

   if (res["@graph"].length != 1) {
      throw new RequestError("Bad length");
   }

   var inst = res["@graph"][0];

   while (inst[propName] != undefined && inst[propName].length == 1) {
      const nextURI = inst[propName][0]["@id"];
      query["@graph"]["@id"] = `${nextURI}`;
      query["$where"].forEach((item, index, arr) => {
         arr[index] = item.replace(`<${inst["@id"]}>`, `<${nextURI}>`);
      });

      var data = await run({ ...query });

      res["@graph"].push(data["@graph"][0]);
      inst = data["@graph"][0];
   }
   return res;
}

export default function runQuery(resource, filters, user) {
   const query = generateQuery(resource, filters, user);
   if (filters._chain == undefined) {
      return run(query);
   }
   return dataChain(query, filters._chain);
}
