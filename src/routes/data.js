import {createResource, getResource, modifyResource, optionalTokenVerify, tokenVerify,} from "../middleware/index.js";
import express from "express";

export const dataRouter = express.Router();

dataRouter.post("/:className", tokenVerify, createResource);
dataRouter.put("/:className/:id", tokenVerify, modifyResource);
dataRouter.patch("/:className/:id", tokenVerify, modifyResource);
dataRouter.delete("/:className/:id/:attributeName?", tokenVerify, modifyResource);
dataRouter.get("/:className/:id?", optionalTokenVerify, getResource);