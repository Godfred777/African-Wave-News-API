import { createServer } from "./server.mjs";
import dotenv from "dotenv";

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost"
const env = process.env.NODE_ENV || "development";

dotenv.config();

const config = {
    port,
    host,
    env
};

const app = createServer(config);

app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
});