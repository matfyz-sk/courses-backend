import expressJWT from "express-jwt";
import { authSecret } from "../constants";
import { client } from "../helpers";

async function setSuperAdmin(req, res, next) {
   if (!req.user) {
      return next();
   }
   try {
      const db = client();
      const data = await db.query(
         `ASK {
           <${req.user.userURI}> courses:isSuperAdmin true
         }`
      );
      req.user.isSuperAdmin = data.boolean;
      next();
   } catch (err) {
      next(err);
   }
}

export const tokenVerify = [expressJWT({ secret: authSecret }), setSuperAdmin];
export const optionalTokenVerify = [
   expressJWT({ secret: authSecret, credentialsRequired: false }),
   setSuperAdmin,
];
