import { createResource, modifyResource, getResource } from "../middleware";
import express from "express";
import expressJWT from "express-jwt";
import { authSecret } from "../constants";

const dataRouter = express.Router();

dataRouter.post("/:className", expressJWT({ secret: authSecret }), createResource);
dataRouter.put("/:className/:id", expressJWT({ secret: authSecret }), modifyResource);
dataRouter.patch("/:className/:id", expressJWT({ secret: authSecret }), modifyResource);
dataRouter.delete(
   "/:className/:id/:attributeName?",
   expressJWT({ secret: authSecret }),
   modifyResource
);
dataRouter.get(
   "/:className/:id?",
   expressJWT({ secret: authSecret, credentialsRequired: false }),
   getResource
);

export default dataRouter;
