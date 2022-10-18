import { expressjwt } from "express-jwt";
import { AUTH_SECRET } from "../constants";
import { client } from "../helpers";

async function setSuperAdmin(req, res, next) {
   if (!req.auth) {
      return next();
   }
   try {
      const db = client();
      const data = await db.query(
         `ASK {
           <${req.auth.userURI}> courses:isSuperAdmin true
         }`
      );
      req.auth.isSuperAdmin = data.boolean;
      next();
   } catch (err) {
      next(err);
   }
}

export const tokenVerify = [expressjwt({ secret: AUTH_SECRET, algorithms: ["HS256"] }), setSuperAdmin];
export const optionalTokenVerify = [
   expressjwt({ secret: AUTH_SECRET,algorithms: ["HS256"], credentialsRequired: false }),
   setSuperAdmin,
];
