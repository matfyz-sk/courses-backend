import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import chalk from "chalk";
import {exec} from 'child_process';
import proxy from 'express-http-proxy';
import fs from 'fs';
import {URL} from 'url';
import {dateTime} from "./helpers/index.js";
import {logger} from "./middleware/logger.js";
import {SparqlSchemaExporter} from "./exporter/sparql-schema-exporter.js";
import {UltraGraphQLConfigurationExporter} from "./exporter/config-ugql-exporter.js";
import {ModelJsonExporter} from "./exporter/model-json-exporter.js";
import {errorHandler} from "./middleware/index.js";
import {dataRouter} from "./routes/data.js";
import {authRouter} from "./routes/auth.js";

const app = express();
const PORT = 3010;
const UGQL_JAR_FILE_PATH = "./src/ultragraphql/ultragraphql-exe.jar";
const UGQL_CONFIG_FILE_PATH = "./src/ultragraphql/config.json";
const UGQL_MODEL_FILE_PATH = "./src/ultragraphql/model.json";
const HOST = "127.0.0.1:";

app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(bodyParser.json({limit: "50mb"}));
app.use(cors());
app.use(logger);
app.use("/data", dataRouter);
app.use("/auth", authRouter);
app.use(errorHandler);

app.listen(PORT, () => {
        console.log(chalk.green(`[${dateTime()}]`), `Server running on port ${PORT}`);
        new SparqlSchemaExporter().exportOntology().then(() => {

            /* UltraGraphQLConfiguration */
            console.log(chalk.green(`[${dateTime()}]`), `Creating UltraGraphQL config.`);

            const ultraGraphQLConfigurationExporter = new UltraGraphQLConfigurationExporter();
            const ultraGraphQLConfiguration = ultraGraphQLConfigurationExporter.getConfiguration();
            const ultraGraphQLConfigStringJson = ultraGraphQLConfigurationExporter.getJsonConfiguration(ultraGraphQLConfiguration);

            fs.writeFileSync(UGQL_CONFIG_FILE_PATH, ultraGraphQLConfigStringJson, {flag: 'w'});
            console.log(chalk.green(`[${dateTime()}]`), ultraGraphQLConfigStringJson);
            console.log(chalk.green(`[${dateTime()}]`), `UltraGraphQL config was created.`);

            /* Converting backend models to json */
            //console.log(chalk.green(`[${dateTime()}]`), `Converting all models to JSON.`);
            const modelJson = new ModelJsonExporter().getAllModelsToJson();
            //console.log(chalk.green(`[${dateTime()}]`), modelJson);
            fs.writeFileSync(UGQL_MODEL_FILE_PATH, modelJson, {flag: 'w'});
            //console.log(chalk.green(`[${dateTime()}]`), `All models converted to JSON.`);

            /* Start UltraGraphQL */
            console.log(chalk.green(`[${dateTime()}]`), `Starting UltraGraphQL`);
            const ultraGraphQLCommand = 'java -jar ' + UGQL_JAR_FILE_PATH + ' --config ' + UGQL_CONFIG_FILE_PATH;
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

            if (!ultraGraphQLConfiguration?.server?.port || !ultraGraphQLConfiguration?.server?.graphql || !ultraGraphQLConfiguration?.server?.graphiql) {
                throw new Error("Cannot start UltraGraphQL endpoint. UltraGraphQL server configuration is missing. Please specify the UltraGraphQL port, graphql and graphiql url.");
            }

            /* Setting UltraGraphQL proxies */
            const graphqlApiProxy = proxy(HOST + ultraGraphQLConfiguration.server.port + '/', {proxyReqPathResolver: req => formProxySuffix(req)});
            const graphqlApiProxyInterface = proxy(HOST + ultraGraphQLConfiguration.server.port + ultraGraphQLConfiguration.server.graphql, {proxyReqPathResolver: req => formProxySuffix(req)});

            const formProxySuffix = (req) => {
                const baseUrl = `${req.protocol}://${req.get('host')}`;
                return new URL(req.originalUrl, baseUrl).pathname
            }

            app.use(ultraGraphQLConfiguration.server.graphql, graphqlApiProxy);
            app.use(ultraGraphQLConfiguration.server.graphiql, graphqlApiProxyInterface);
        });
    }
)
