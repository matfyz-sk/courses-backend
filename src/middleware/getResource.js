import RequestError from "../helpers/RequestError.js";
import {DataController} from "../controllers/index.js";
import {classPrefix, client, getResourceObject, uri2className} from "../helpers/index.js";
import _ from "lodash";

async function resolveResource(req, res, next) {
    try {
        const baseClassName = req.params.className;
        const id = req.params.id;

        const resource = getResourceObject(baseClassName);
        if (id === undefined) {
            res.locals.resource = resource;
            return next();
        }
        const db = client();
        const data = await db.query(
            `SELECT ?type
          WHERE {
             ?uri rdf:type ?type .
             FILTER regex(?uri, "${id}$")
          }`,
            false
        );
        const results = data.results.bindings;
        if (results.length === 0) {
            throw new RequestError(
                `Resource with URI '${
                    classPrefix(baseClassName) + id
                }' doesn't exist.`,
                404
            );
        }

        const resArray = [];
        results.map((result) => {
            console.log(result);
            resArray.push(getResourceObject(uri2className(result.type.value)));
        });

        //console.log(resArray);
        //console.log("merge", _.mergeWith(resArray[0], resArray[1], customizer));

        res.locals.resource = resArray[0];
        next();
    } catch (err) {
        next(err);
    }
}

function customizer(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
    if (_.isString(objValue)) {
        if (_.isString(srcValue)) {
            return [objValue, srcValue];
        }
        if (_.isArray(srcValue)) {
            return [objValue].concat(srcValue);
        }
    }
}

async function _getResource(req, res, next) {
    try {
        if (req.query._subclasses != undefined) {
            return res
                .status(200)
                .json({value: DataController.getResourceSubclasses(res.locals.resource)});
        }
        if (req.params.id) {
            req.query["id"] = req.params.id;
        }

        const data = await DataController.getResource(res.locals.resource, req.query, req.auth);
        res.status(200).send(data);
    } catch (err) {
        next(err);
    }
}

export const getResource = [resolveResource, _getResource];
