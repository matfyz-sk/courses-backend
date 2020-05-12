import {
   createResource,
   modifyResource,
   getResource,
   tokenVerify,
   optionalTokenVerify,
} from "../middleware";
import express from "express";

const dataRouter = express.Router();

dataRouter.post("/:className", tokenVerify, createResource);
dataRouter.put("/:className/:id", tokenVerify, modifyResource);
dataRouter.patch("/:className/:id", tokenVerify, modifyResource);
dataRouter.delete("/:className/:id/:attributeName?", tokenVerify, modifyResource);
dataRouter.get("/:className/:id?", optionalTokenVerify, getResource);

export default dataRouter;
