import Resource from "../resource";
import {getResourceObject} from "../helpers";

export function prepareResource(req, res, next) {
    try {
        res.locals.resource = new Resource({
            resource: getResourceObject(req.params.className),
            user: req.auth,
            id: req.params.id,
            operation: req.method,
        });
        next();
    } catch (err) {
        next(err);
    }
}
