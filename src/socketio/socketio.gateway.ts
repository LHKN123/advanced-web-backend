import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
  // namespace: 'grades',
  // access methods of the controller with same gateway
})
export class SocketioGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketioGateway.name);
  // for grading services
  constructor(private readonly usersService: UsersService) {}

  @WebSocketServer() io: Namespace;

  afterInit(server: any) {
    this.logger.log('Websocket gateway initialized');
  }

  handleConnection(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`Client with id ${client.id} connected`);
    this.logger.log(`Number of connected sockets: ${sockets.size} connected`);
  }

  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`Disconnected id: ${client.id}`);
    this.logger.log(`Number of connected sockets: ${sockets.size} connected`);
  }
}
