import Resource from "../resource";
import { getResourceObject } from "../helpers";

export function prepareResource(req, res, next) {
   try {
      res.locals.resource = new Resource({
         resource: getResourceObject(req.params.className),
         user: req.user,
         id: req.params.id,
      });
      next();
   } catch (err) {
      next(err);
   }
}
