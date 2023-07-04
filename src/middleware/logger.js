import chalk from "chalk";
import {dateTime} from "../helpers/index.js";

export function logger(req, res, next) {
    console.log(chalk.green(`[${dateTime()}]`), chalk.yellow(req.method), req.originalUrl);
    next();
}
