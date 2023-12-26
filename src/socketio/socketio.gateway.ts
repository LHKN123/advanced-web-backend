import { Inject, Logger, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { WsJwtAuthGuard } from './guard/ws-jwt.guard';
import { SocketWithData } from './dto/socket-with-data.dto';

class tokenPayload {
  id: string;
}

// let configService: ConfigService;
// const clientPort = parseInt(configService.get('CLIENT_PORT'));
const clientPort = 3000;

@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: [
      `http://localhost:${clientPort}`,
      new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      'https://advanced-web-frontend-zeta.vercel.app/',
    ],
  },
})
export class SocketioGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketioGateway.name);
  constructor(
    // for grade / class / review services
    // private readonly classService: ClassService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer() io: Namespace;
  socketMap = new Map<string, tokenPayload>();

  afterInit(): void {
    this.logger.log('Websocket gateway initialized');
  }

  async handleConnection(client: SocketWithData) {
    try {
      const sockets = this.io.sockets;

      let token = client.handshake.auth.token;

      console.log(token);

      if (!token) {
        client.disconnect(true);
      }

      const publicKey = await this.configService.get<string>(
        'EXP_IN_REFRESH_TOKEN',
      );
      const secret = await this.configService.get<string>('JWT_SECRET');
      const payload = (await this.jwtService.verifyAsync(token, {
        publicKey,
        secret,
      })) as tokenPayload;
      if (!payload) {
        client.disconnect(true);
      }

      this.socketMap.set(token, payload);

      console.log(`Client with id ${client.id} connected`);
      console.log(`Number of connected sockets: ${sockets.size} connected`);

      const roomNameList = [client.class_id, ...client.review_id_list];
      await client.join(roomNameList);

      // log test
      for (const roomName of roomNameList) {
        const connectedClients = this.io.adapter.rooms.get(roomName).size ?? 0;

        console.log(`userID: ${client.id} joined room with name: ${roomName}`);
        console.log(
          `Total clients connected to room '${roomName}': ${connectedClients}`,
        );
      }
    } catch (error) {
      console.error('Error handling connection:', error.message);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;
    this.socketMap.delete(client.id);

    this.logger.log(`Disconnected id: ${client.id}`);
    this.logger.log(`Number of connected sockets: ${sockets.size} connected`);
  }

  @SubscribeMessage('newMessage')
  @UseGuards(WsJwtAuthGuard)
  sendMessage(
    // @ConnectedSocket() client: Socket,
    @ConnectedSocket() client: SocketWithData,
    @MessageBody() message: any,
    @Req() req: any,
  ) {
    console.log(req.user);
    this.io.on('sendMessage', (message) => {});
    this.io.emit('onMessage', message);
  }

  // add more subscribe messages?
  @SubscribeMessage('notify')
  @UseGuards(WsJwtAuthGuard)
  notify(
    @ConnectedSocket() client: SocketWithData,
    @MessageBody() message: any,
    @Req() req: any,
  ) {
    console.log('req user', req.user);
    console.log('req', req);

    // this.io.on('notify', (message) => {});

    const roomNameList = [client.class_id, ...client.review_id_list];
    this.io.to(roomNameList).emit('returnNotification', message);
  }
}
