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
   debug: true,
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

   var id;

   if (filters.id) {
      id = `<${classPrefix(resource.obj.type) + filters.id}>`;
      query["@graph"]["@id"] = classPrefix(resource.obj.type) + filters.id;
   } else {
      id = "?id";
      query["@graph"]["@id"] = "?id";
   }

   query["@graph"]["@type"] = "?type";
   query.$where.push(`${id} rdf:type ?type`);
   query.$where.push(`?type rdfs:subClassOf* ${className(resource.obj.type, true)}`);

   query["@graph"]["createdBy"] = "?createdBy";
   query["@graph"]["createdAt"] = "?createdAt";
   query.$where.push(`OPTIONAL { ${id} courses:createdBy ?createdBy }`);
   query.$where.push(`OPTIONAL { ${id} dc:created ?createdAt }`);

   if (filters._orderBy) {
      query.$orderby = [`?${filters._orderBy}`];
   }

   const joins =
      filters.hasOwnProperty("_join") && typeof filters._join == "string"
         ? filters._join.split(",").map((e) => e.trim())
         : [];

   Object.keys(resource.props).forEach((predicateName) => {
      var objectVar = `?${predicateName}`;
      if (resource.props[predicateName].dataType === "node") {
         objectVar += "URI";
         query["@graph"][predicateName] = { "@id": objectVar };
         var where = `OPTIONAL { ${id} courses:${predicateName} ${objectVar} . `;

         if (joins.includes(predicateName)) {
            const joinResource = getResourceObject(resource.props[predicateName].objectClass);
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
         }

         where = where.substring(0, where.length - 2) + "}";
         query.$where.push(where);

         if (filters.hasOwnProperty(predicateName)) {
            query.$where.push(
               `FILTER EXISTS { ${id} courses:${predicateName} <${
                  classPrefix(resource.props[predicateName].objectClass) + filters[predicateName]
               }> }`
            );
         }
         return;
      }
      query["@graph"][predicateName] = objectVar;
      if (filters.hasOwnProperty(predicateName)) {
         query.$where.push(`${id} courses:${predicateName} ${objectVar}`);
         if (resource.props[predicateName].dataType == "string") {
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
         resource.props.hasOwnProperty(predicateName)
      ) {
         return;
      }
      query.$where.push(`${id} ^courses:${predicateName} ?${predicateName}URI`);
      query.$filter.push(`regex (?${predicateName}URI, "${filters[predicateName]}$")`);
   });
   const authWhere = resolveAuthRules(id, resource, user);
   if (authWhere.length > 0) {
      query.$where.push(authWhere);
   }
   return query;
}

function resolveAuthRules(id, resource, user) {
   var rules = getResourceShowRules(resource.obj);
   var courseInstance = resource.props.courseInstance
      ? "courseInstance"
      : getResourceCourseInstance(resource.obj);

   console.log(rules, courseInstance);

   var predicate = "";

   if (courseInstance == null) {
      if (rules.length == 0) {
         return "";
      }
      return "";
   }

   if (rules.length == 1 && rules[0] == "all") {
      return "";
   }

   if (user == undefined) {
      throw new RequestError("You don't have access rights to this resource", 401);
   }

   if (rules.length == 0) {
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
      if (rule === "all") {
         return "";
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

function _nodesToArray(obj) {
   if (obj.constructor.name == "Array") {
      for (var val of obj) {
         _nodesToArray(val);
      }
      return;
   }
   for (var predicateName in obj) {
      if (obj.hasOwnProperty(predicateName)) {
         if (obj[predicateName].constructor.name != "Object") {
            continue;
         }
         if (Object.keys(obj[predicateName]).length == 0) {
            obj[predicateName] = [];
         } else {
            _nodesToArray(obj[predicateName]);
            obj[predicateName] = [obj[predicateName]];
         }
      }
   }
}

async function run(query) {
   const data = await lib.default(query, sparqlOptions);
   _nodesToArray(data["@graph"]);
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

export default function runQuery(_resource, filters, user) {
   const query = generateQuery(
      {
         obj: _resource,
         props: getAllProps(_resource),
         uri: "?resourceURI",
      },
      filters,
      user
   );
   if (filters._chain == undefined) {
      return run(query);
   }
   return dataChain(query, filters._chain);
}
