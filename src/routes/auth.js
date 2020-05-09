import { login, register, githubLogin } from "../middleware";
import express from "express";
import { changePassword } from "../middleware/auth/changePassword";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/github", githubLogin);
authRouter.patch("/user/:userId/password", changePassword);

export default authRouter;
