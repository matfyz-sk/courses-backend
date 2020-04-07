import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import chalk from "chalk";
import dataRouter from "./routes/data";
import authRouter from "./routes/auth";
import { errorHandler, authorization } from "./middleware";

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
   console.log(chalk.green(`[${Date.now()}]`));
   next();
});
app.use("/data", authorization, dataRouter);
app.use("/auth", authRouter);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
