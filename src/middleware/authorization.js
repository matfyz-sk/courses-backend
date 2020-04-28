import expressJWT from "express-jwt";
import { authSecret } from "../constants";

export const authorization = [expressJWT({ secret: authSecret })];
