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
import url from 'url';
import proxy from 'express-http-proxy';

const app = express();
const port = 3010;
const ultraGraphQLPort = 8080; //This port must correspond to the port in config.json file for ultraGraphQL

app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(bodyParser.json({limit: "50mb"}));
app.use(cors());
app.use(logger);
app.use("/data", dataRouter);
app.use("/auth", authRouter);
app.use(errorHandler);

app.listen(port, () => {
        console.log(chalk.green(`[${dateTime()}]`), `Server running on port ${port}`);
        new ExporterSparql().exportOntology().then(() => {
            console.log(chalk.green(`[${dateTime()}]`), `Starting UltraGraphQL`);
            const ultraGraphQLCommand = 'java -jar ./src/ultragraphql/ultragraphql-1.1.4-exe.jar --config ./src/ultragraphql/config.json';
            const ultraGraphQLProcess = exec(ultraGraphQLCommand);
            ultraGraphQLProcess.stdout.on('data', function (data) {
                console.log(chalk.green(`[${dateTime()}]`), `UltraGraphQL ${data}`);
            });
            ultraGraphQLProcess.stdin.on('data', function (data) {
                console.log(chalk.yellow(`[${dateTime()}]`), `UltraGraphQL ${data}`);
            });
            ultraGraphQLProcess.stderr.on('data', function (data) {
                console.log(chalk.red(`[${dateTime()}]`), `UltraGraphQL ${data}`);
            });

            const graphqlApiProxy = proxy('http://localhost:' + ultraGraphQLPort + '/', {
                proxyReqPathResolver: req => url.parse(req.baseUrl).path
            });

            const graphqlApiProxyInterface = proxy('http://localhost:' + ultraGraphQLPort + '/graphiql', {
                proxyReqPathResolver: req => url.parse(req.baseUrl).path
            });
            app.use("/graphql", graphqlApiProxy);
            app.use("/graphiql", graphqlApiProxyInterface);
        });
    }
)

