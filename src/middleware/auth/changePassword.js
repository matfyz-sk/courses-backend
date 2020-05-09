import { body } from "express-validator";
import bcrypt from "bcrypt";
import { client } from "../../helpers";
import { graphURI } from "../../constants";
import { checkValidation } from "./checkValidation";

const bodyValidation = [body("password").exists().isString().isLength({ min: 6 })];

async function _changePassword(req, res) {
   const userId = req.params.userId;
   const userURI = `${graphURI}/user/${userId}`;
   const hash = bcrypt.hashSync(req.body.password, 10);
   const db = client();
   const userExists = await db.query(`ASK { <${userURI}> rdf:type courses:User }`, true);
   if (!userExists.boolean) {
      return res.status(404).send({ status: false, message: "User not exist" });
   }
   await db.query(`DELETE WHERE { <${userURI}> courses:password ?password }`, true);
   await db.query(
      `INSERT IN GRAPH <${graphURI}> { <${userURI}> courses:password "${hash}" }`,
      true
   );
}

export const changePassword = [bodyValidation, checkValidation, _changePassword];
