import RequestError from "../helpers/RequestError";
import { DataController } from "../controllers";
import { getResourceObject, client, className, uri2className, classPrefix } from "../helpers";

async function resolveResource(req, res, next) {
   try {
      const resource = getResourceObject(req.params.className);
      if (req.params.id == undefined) {
         res.locals.resource = resource;
         return next();
      }
      const db = client();
      const data = await db.query(
         `SELECT ?type
          WHERE {
             ?uri rdf:type ?type .
             ?type rdfs:subClassOf* ${className(req.params.className, true)} .
             FILTER regex(?uri, "${req.params.id}$")
          }`,
         false
      );
      const results = data.results.bindings;
      if (results.length === 0) {
         throw new RequestError(
            `Resource with URI '${
               classPrefix(req.params.className) + req.params.id
            }' doesn't exist.`,
            404
         );
      }
      if (results.length > 1) {
         throw new RequestError(`More than one sub-resource of ID '${req.params.id}' exists.`, 400);
      }
      const name = uri2className(results[0].type.value);
      res.locals.resource = getResourceObject(name);
      next();
   } catch (err) {
      next(err);
   }
}

async function _getResource(req, res, next) {
   try {
      if (req.query._subclasses != undefined) {
         return res
            .status(200)
            .json({ value: DataController.getResourceSubclasses(res.locals.resource) });
      }
      if (req.params.id) {
         req.query["id"] = req.params.id;
      }
      const data = await DataController.getResource(res.locals.resource, req.query, req.user);
      res.status(200).send(data);
   } catch (err) {
      next(err);
   }
}

export const getResource = [resolveResource, _getResource];
