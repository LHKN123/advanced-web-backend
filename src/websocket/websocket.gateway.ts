import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('login')
  handleLogin(@MessageBody() user: any): void {
    // Handle the login logic and send the user data back to the client
    const processedUserData = this.processLogin(user);

    // Send the processed user data back to the client
    this.server.emit('loginResponse', processedUserData);
  }

  private processLogin(user: any): any {
    // Your login logic here
    // Example: Save user to the database, generate tokens, etc.

    // Return the processed user data
    return {
      username: user.username,
      // Other user-related data...
    };
  }
}
