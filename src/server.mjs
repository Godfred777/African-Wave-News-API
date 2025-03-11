import express from 'express';
import BodyParser from 'body-parser';

// Create a new express application
export function createApp(config) {

    const app = express();

    app.set('port', config.port);
    app.set('host', config.host);
    app.set('env', config.env);

    app.use(BodyParser.json());
    app.use(BodyParser.urlencoded({ extended: true }));

    return app;
}