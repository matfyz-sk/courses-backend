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
import {JsonExporter} from "./exporter/json-exporter";
import {UltraGraphQLExporter} from "./exporter/ugql-exporter";

const fs = require('fs');

const app = express();
const port = 3010;
const ultraGraphQLConfig = "./src/ultragraphql/config.json";

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

            console.log(chalk.green(`[${dateTime()}]`), `Creating UltraGraphQL config.`);
            const ultraGraphQLConfigStringJson = new UltraGraphQLExporter().getConfiguration();
            fs.writeFileSync('./src/ultragraphql/config.json', ultraGraphQLConfigStringJson, {flag: 'w'});
            console.log(chalk.green(`[${dateTime()}]`), ultraGraphQLConfigStringJson);
            console.log(chalk.green(`[${dateTime()}]`), `UltraGraphQL config was created.`);

            console.log(chalk.green(`[${dateTime()}]`), `Converting all models to JSON.`);
            const modelJson = new JsonExporter().getAllModelsToJson();
            console.log(chalk.green(`[${dateTime()}]`), modelJson);
            fs.writeFileSync('./src/ultragraphql/model.json', modelJson, {flag: 'w'});
            console.log(chalk.green(`[${dateTime()}]`), `All models converted to JSON.`);

            console.log(chalk.green(`[${dateTime()}]`), `Starting UltraGraphQL`);
            const ultraGraphQLCommand = 'java -jar ./src/ultragraphql/ultragraphql-1.1.5-exe.jar --config ' + ultraGraphQLConfig;
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

            const configFileParsed = JSON.parse(fs.readFileSync(ultraGraphQLConfig));

            if (!configFileParsed?.server?.port || !configFileParsed?.server?.graphql || !configFileParsed?.server?.graphiql) {
                throw new Error("Cannot start UltraGraphQL endpoint. UltraGraphQL server configuration is missing. Please specify the UltraGraphQL port, graphql and graphiql url.");
            }

            const ultraGraphQLServerConfig = configFileParsed.server;

            const graphqlApiProxy = proxy('http://localhost:' + ultraGraphQLServerConfig.port + '/', {
                proxyReqPathResolver: req => url.parse(req.baseUrl).path
            });

            const graphqlApiProxyInterface = proxy('http://localhost:' + ultraGraphQLServerConfig.port + ultraGraphQLServerConfig.graphql, {
                proxyReqPathResolver: req => url.parse(req.baseUrl).path
            });
            app.use(ultraGraphQLServerConfig.graphql, graphqlApiProxy);
            app.use(ultraGraphQLServerConfig.graphiql, graphqlApiProxyInterface);
        });
    }
)

