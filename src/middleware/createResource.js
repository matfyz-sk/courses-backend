import {DataController} from "../controllers/index.js";
import {prepareResource} from "./prepareResource.js";
import {responseHandler} from "./responseHandler.js";

async function _createResource(req, res, next) {
    try {
        await DataController.createResource(res.locals.resource, req.body);
        next();
    } catch (err) {
        next(err);
    }
}

export const createResource = [prepareResource, _createResource, responseHandler];
