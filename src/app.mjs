import { createApp } from "./server.mjs";
import dotenv from "dotenv";
import {articleRouter} from "./api/routes/articleRoutes.mjs";
import { createSocketServer } from "./sockets/socketServer.mjs";
import i18n from "../src/config/i18n.mjs";
import * as middleware from "i18next-http-middleware";
import { startFeedScheduler } from "./services/scheduler.mjs";


const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost"
const env = process.env.NODE_ENV || "development";

dotenv.config();

const config = {
    port,
    host,
    env
};

const app = createApp(config);
const {server, io} = createSocketServer(app);

app.use(articleRouter);
app.use(middleware.handle(i18n));

server.listen(port, host, () => {
    console.log(
        `HTTP/WebSocket server listening on:
        -HTTP: http://${host}:${port}
        -WebSocket: ws://${host}:${port}`
    );
    startFeedScheduler();
});