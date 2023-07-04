import {changePassword, githubLogin, login, register} from "../middleware";
import express from "express";

export const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/github", githubLogin);
authRouter.patch("/user/:userId/password", changePassword);
