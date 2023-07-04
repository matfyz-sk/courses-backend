import {DataController} from "../controllers/index.js";
import {prepareResource} from "./prepareResource.js";
import {fetchResource} from "./fetchResource.js";
import {responseHandler} from "./responseHandler.js";

async function _modifyResource(req, res, next) {
    const resource = res.locals.resource;
    const requestMethod = req.method;
    try {
        if (requestMethod === "PUT" || requestMethod === "PATCH") {
            await DataController.updateResource(resource, req.body);
        } else if (requestMethod === "DELETE") {
            await DataController.deleteResource(resource, req.params.attributeName, req.body.value);
        }
        next();
    } catch (err) {
        next(err);
    }
}

export const modifyResource = [prepareResource, fetchResource, _modifyResource, responseHandler];
