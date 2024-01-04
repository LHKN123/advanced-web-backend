import { Logger, Req, UseGuards } from '@nestjs/common';
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
import { ClassesService } from 'src/classes/classes.service';
import { ReviewService } from 'src/review/review.service';
import { UsersService } from 'src/users/users.service';

class tokenPayload {
  id: string;
}

class userData {
  studentId: string;
  enrolledClassesId: string[];
  teachingClassesId: string[];
  reviewIdList: string[];
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
    // for user / class / review services
    private readonly usersService: UsersService,
    private readonly classesService: ClassesService,
    private readonly reviewService: ReviewService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer() io: Namespace;

  socketMap = new Map<string, string>();
  dataMap = new Map<string, userData>();

  afterInit(): void {
    this.logger.log('Websocket gateway initialized');
  }

  // async handleConnection(client: SocketWithData) {
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

      this.socketMap.set(token, payload.id);

      console.log(`Client with id ${client.id} connected`);
      console.log(`Number of connected sockets: ${sockets.size} connected`);

      let userId = payload.id;

      //TODO: use usersService
      let user = await this.usersService.getUserById(userId);
      let studentId = '';

      if (user) {
        studentId = user.student_id;
      }

      //get classes and reviews

      //TODO: use classesService
      let enrolledClasses =
        await this.classesService.getAllEnrolledClasses(userId);
      let teachingClasses =
        await this.classesService.getAllTeachingClasses(userId);

      let enrolledClassesId = [];
      let teachingClassesId = [];

      let reviewIdList = [];

      if (studentId && studentId != '') {
        if (enrolledClasses) {
          enrolledClasses.forEach((element) => {
            async () => {
              let temp = await this.reviewService.getReviewIdListForStudent(
                studentId,
                element._id,
              );

              reviewIdList = [...reviewIdList, ...temp];

              enrolledClassesId.push(element._id);
            };
          });
        }
      }

      if (teachingClasses) {
        teachingClasses.forEach((element) => {
          async () => {
            let temp = await this.reviewService.getReviewIdListForTeacher(
              element._id,
            );

            reviewIdList = [...reviewIdList, ...temp];

            teachingClassesId.push(element._id);
          };
        });
      }

      let myUserData = {
        studentId: studentId,
        enrolledClassesId: enrolledClassesId,
        teachingClassesId: teachingClassesId,
        reviewIdList: reviewIdList,
      };
      this.dataMap.set(userId, myUserData);

      console.log('my user data: ', myUserData);

      // join all user classes and review id
      const roomNameList = [
        ...enrolledClassesId,
        ...teachingClassesId,
        ...reviewIdList,
      ];
      await client.join(roomNameList);

      console.log('my rooms: ', roomNameList);
      // // log test
      // for (const roomName of roomNameList) {
      //   const connectedClients = this.io.adapter.rooms.get(roomName).size ?? 0;

      //   console.log(`userID: ${client.id} joined room with name: ${roomName}`);
      //   console.log(
      //     `Total clients connected to room '${roomName}': ${connectedClients}`,
      //   );
      // }
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

  // add more subscribe messages?
  @SubscribeMessage('notify')
  @UseGuards(WsJwtAuthGuard)
  notify(
    // @ConnectedSocket() client: SocketWithData,
    @ConnectedSocket() client: Socket,
    @MessageBody() message: { value: string; room: string },
    @Req() req: any,
  ) {
    console.log('req user', req.user);
    console.log('req', req);

    // let token = client.handshake.auth.token;
    // let userId = this.socketMap.get(token);

    this.io.on('notify', (message) => {});

    // TODO:
    // only notify target class or review
    const target = message.room;
    this.io.to(target).emit('returnNotification', message.value);

    //for testing only
    // this.io.emit('returnNotification', message.value);

    // alternative way: notify everyone
    // const roomNameList = [client.class_id_list, ...client.review_id_list];
    // this.io.to(roomNameList).emit('returnNotification', message);
  }
}
