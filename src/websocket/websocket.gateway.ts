import { Req } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ReturnUserDto } from 'src/auth/dto/return_user.dto';

@WebSocketGateway({ namespace: 'login', cors: { origin: '*' } })
export class WebsocketGateway {
  @WebSocketServer()
  io: Server;

  async handleConnection(client: Socket) {
    console.log(`Login client id ${client.id} connected`);
    this.io.emit('loginResponse', 'Hello world');
  }

  handleDisconnect(client: Socket) {
    console.log(`Login client id ${client.id} failed`);
  }

  @SubscribeMessage('loginInfo')
  handleLogin(
    // @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
    // @Req() req: any,
  ): void {
    // const processedUserData = this.processLogin(user);

    //this.io.emit('loginResponse', processedUserData);

    console.log('Sending login response', message);
    this.io.emit('loginResponse', message);
    console.log('Finish login response');
  }

  private processLogin(user: ReturnUserDto): ReturnUserDto {
    return {
      username: user.username,
      email: user.email,
      access_token: user.access_token,
      refresh_token: user.refresh_token,
    };
  }
}
