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
    // for grading services
    // private readonly gradeService: GradeService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer() io: Namespace;
  socketMap = new Map<string, tokenPayload>();

  afterInit(server: any) {
    this.logger.log('Websocket gateway initialized');
  }

  // revise this later
  async onModuleInit() {
    this.io.on('connection', async (socket) => this.handleConnection(socket));
  }

  async handleConnection(client: Socket) {
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
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any,
    @Req() req: any,
  ) {
    console.log(req.user);
    this.io.on('sendMessage', (message) => {});
    this.io.emit('onMessage', message);
  }
}
