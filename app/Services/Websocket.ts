import { Server, Socket } from 'socket.io';
import AdonisServer from '@ioc:Adonis/Core/Server'


class Websocket {
    private io: Server;

    public start(callback: (socket: Socket) => void) {
        this.io = new Server(AdonisServer.instance!);
        this.io.on('connection', callback);
    }
    public getIo(): Server {
        return this.io;
    }
}

export default new Websocket();