import {body} from "express-validator";
import bcrypt from "bcrypt";
import {client} from "../../helpers/index.js";
import {DATA_IRI, GRAPH_IRI, PASSWORD_SALT} from "../../constants/index.js";
import {checkValidation} from "./checkValidation.js";

const bodyValidation = [body("password").exists().isString().isLength({min: 6})];

async function _changePassword(req, res) {
    const userId = req.params.userId;
    const userURI = `${DATA_IRI}/user/${userId}`;
    const hash = bcrypt.hashSync(req.body.password, PASSWORD_SALT);
    const db = client();
    const userExists = await db.query(`ASK { <${userURI}> rdf:type courses:User }`, true);
    if (!userExists.boolean) {
        return res.status(404).send({status: false, message: "User not exist"});
    }
    await db.query(`DELETE WHERE { <${userURI}> courses:password ?password }`, true);
    await db.query(
        `INSERT IN GRAPH <${GRAPH_IRI}> { <${userURI}> courses:password "${hash}" }`,
        true
    );
    res.send({status: true});
}

export const changePassword = [bodyValidation, checkValidation, _changePassword];
