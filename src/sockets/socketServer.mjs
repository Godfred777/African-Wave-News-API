import http from 'http';
import { Server } from 'socket.io';

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


    io.on('connection', (socket) => {
        console.log('A user connected', {
            headers: socket.handshake.headers,
            address: socket.handshake.address,
            secure: socket.handshake.secure,
            protocol: socket.handshake.protocol
        });


        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });

    return {
        server,
        io
    };
}