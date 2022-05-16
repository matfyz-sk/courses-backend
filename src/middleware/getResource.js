import RequestError from "../helpers/RequestError";
import {DataController} from "../controllers";
import {classPrefix, client, getResourceObject, uri2className} from "../helpers";
import _ from "lodash";

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

        const resArray = [];
        results.map((result) => {
            console.log("uriTocLASSnAME", result.type.value, uri2className(result.type.value));
            resArray.push(getResourceObject(uri2className(result.type.value)));
        });

        console.log(resArray);
        console.log("merge", _.mergeWith(resArray[0], resArray[1], customizer));

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
        const data = await DataController.getResource(res.locals.resource, req.query, req.user);
        res.status(200).send(data);
    } catch (err) {
        next(err);
    }
}

export const getResource = [resolveResource, _getResource];
