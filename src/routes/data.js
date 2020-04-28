import { createResource, modifyResource, getResource, authorization } from "../middleware";
import express from "express";
import expressJWT from "express-jwt";
import { authSecret } from "../constants";

const dataRouter = express.Router();

dataRouter.post("/:className", authorization, createResource);
dataRouter.put("/:className/:id", authorization, modifyResource);
dataRouter.patch("/:className/:id", authorization, modifyResource);
dataRouter.delete("/:className/:id/:attributeName?", authorization, modifyResource);

dataRouter.get(
   "/:className/:id?",
   expressJWT({ secret: authSecret, credentialsRequired: false }),
   getResource
);

export default dataRouter;
