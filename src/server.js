import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import chalk from "chalk";
import dataRouter from "./routes/data";
import authRouter from "./routes/auth";
import {errorHandler} from "./middleware";
import {dateTime} from "./helpers";
import {logger} from "./middleware/logger";
import {ExporterSparql} from "./exporter/exporter-sparql";
import {exec} from 'child_process';

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(bodyParser.json({limit: "50mb"}));
app.use(cors());
app.use(logger);
app.use("/data", dataRouter);
app.use("/auth", authRouter);
app.use(errorHandler);

app.listen(port, () => {
        console.log(chalk.green(`[${dateTime()}]`), `Server running on port ${port}`);
        const exporterSparql = new ExporterSparql();
        let ultraGraphQLProcess;

        exporterSparql.exportOntology().then(() => {
            console.log(chalk.green(`[${dateTime()}]`), `Starting UltraGraphQL`);
            const ultraGraphQLCommand = 'java -jar ./src/ultragraphql/ultragraphql-1.1.4-exe.jar --config ./src/ultragraphql/config.json';
            ultraGraphQLProcess = exec(ultraGraphQLCommand);
            ultraGraphQLProcess.stdout.on('data', function (data) {
                console.log(chalk.green(`[${dateTime()}]`), `UltraGraphQL ${data}`);
            });
            ultraGraphQLProcess.stdin.on('data', function (data) {
                console.log(chalk.yellow(`[${dateTime()}]`), `UltraGraphQL ${data}`);
            });
            ultraGraphQLProcess.stderr.on('data', function (data) {
                console.log(chalk.red(`[${dateTime()}]`), `UltraGraphQL ${data}`);
            });
        });
    }
)

