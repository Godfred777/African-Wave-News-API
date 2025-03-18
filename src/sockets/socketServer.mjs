import http from 'http';
import { Server } from 'socket.io';
import {
  emitFeed,
  emitTranslatedFeedInFrench,
  emitTranslatedFeedInGerman,
  emitTranslatedFeedInSpanish,
} from "../services/webSocketService.mjs";

export function createSocketServer(app) {
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        },
        path: '/socket.io',
        pingTimeout: 60000,
        maxHttpBufferSize: 1e8,
        transports: ['websocket'],
        allowUpgrades: false
    });

    io.engine.on('connection_error', (err) => {
        console.log(err.req);
        console.log(err.code);
        console.log(err.message);
        console.log(err.context);
    });


    io.on('connection', async(socket) => {
        console.log('A user connected', {
            headers: socket.handshake.headers,
            address: socket.handshake.address,
            secure: socket.handshake.secure,
            protocol: socket.handshake.protocol
        });

        await Promise.all([
            emitFeed(socket),
            emitTranslatedFeedInFrench(socket),
            emitTranslatedFeedInGerman(socket),
            emitTranslatedFeedInSpanish(socket)
        ]);

        const interval = setInterval(async () => {
            await Promise.all([
            emitFeed(socket),
            emitTranslatedFeedInFrench(socket),
            emitTranslatedFeedInGerman(socket),
            emitTranslatedFeedInSpanish(socket)
            ]);
        }, 120000); // Changed to 120000ms (2 minutes)

        socket.on('disconnect', () => {
            console.log('User disconnected');
            clearInterval(interval);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
            clearInterval(interval);
        });
    });

    return {
        server,
        io
    };
}