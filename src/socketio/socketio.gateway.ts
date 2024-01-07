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

      //let token = req.handshake.headers.authorization.split(' ')[1]; //postman test
      let token = client.handshake.auth.token;

      console.log('token', token);

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

      //use usersService
      let user = await this.usersService.getUserById(userId);
      let studentId = '';

      if (user) {
        studentId = user.student_id;
      }

      //get classes and reviews

      //use classesService
      let enrolledClasses =
        await this.classesService.getAllEnrolledClasses(userId);
      let teachingClasses =
        await this.classesService.getAllTeachingClasses(userId);

      console.log('my enrolledClasses: ', enrolledClasses);
      console.log('my teachingClasses: ', teachingClasses);

      let enrolledClassesId = [];
      let teachingClassesId = [];

      let reviewIdList = [];

      await (async () => {
        if (studentId && studentId != '') {
          if (enrolledClasses) {
            enrolledClasses.forEach(async (element) => {
              enrolledClassesId.push(element._id.toString());
              console.log('enrolledClassesId', enrolledClassesId);

              let temp = await this.reviewService.getReviewIdListForStudent(
                studentId,
                element._id.toString(),
              );
              if (temp.length > 0) {
                reviewIdList = [...reviewIdList, ...temp];
                console.log('reviewIdList in enrolled', temp);
              }
            });
          }
        }
      })();

      await (async () => {
        if (teachingClasses) {
          teachingClasses.forEach(async (element) => {
            teachingClassesId.push(element._id.toString());
            console.log('teachingClassesId', teachingClassesId);

            let temp = await this.reviewService.getReviewIdListForTeacher(
              element._id.toString(),
            );
            if (temp.length > 0) {
              reviewIdList = [...reviewIdList, ...temp];
              console.log('reviewIdList in teaching', temp);
            }
          });
        }
      })();

      await (async () => {
        let myUserData = {
          studentId: studentId,
          enrolledClassesId: enrolledClassesId,
          teachingClassesId: teachingClassesId,
          reviewIdList: reviewIdList,
        };
        // this.dataMap.set(userId, myUserData);

        console.log('my user data: ', myUserData);

        // join all user classes and review id
        const roomNameList = [
          ...enrolledClassesId,
          ...teachingClassesId,
          ...reviewIdList,
        ];

        console.log('my rooms: ', roomNameList);
        await client.join(roomNameList);

        // // log test
        for (const roomName of roomNameList) {
          const connectedClients =
            this.io.adapter.rooms.get(roomName).size ?? 0;

          console.log(
            `userID: ${client.id} joined room with name: ${roomName}`,
          );
          console.log(
            `Total clients connected to room '${roomName}': ${connectedClients}`,
          );
        }
        //
      })();
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

  @SubscribeMessage('sendMessage')
  @UseGuards(WsJwtAuthGuard)
  sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('message') message: string,
    @Req() req: any,
  ) {
    this.io.on('sendMessage', ({ message }) => {});
    console.log(req.user);
    client.emit('onMessage', message);
  }

  @SubscribeMessage('notify')
  @UseGuards(WsJwtAuthGuard)
  notify(
    // @ConnectedSocket() client: SocketWithData,
    @ConnectedSocket() client: Socket,
    @MessageBody('body') body: { message: string; room: string },
    @Req() req: any,
  ) {
    this.io.on('notify', ({ body }) => {});
    console.log('req user', req.user);
    console.log('req', req);
    // TODO:
    // only notify target class or review
    client.to(body.room).emit('returnNotification', body.message);
  }
}
