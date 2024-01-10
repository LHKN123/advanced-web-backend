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
  // dataMap = new Map<string, userData>();

  afterInit(): void {
    this.logger.log('Websocket gateway initialized');
  }

  // async handleConnection(client: SocketWithData) {
  async handleConnection(client: Socket) {
    try {
      const sockets = this.io.sockets;

      //let token = req.handshake.headers.authorization.split(' ')[1]; //postman test
      let token = client.handshake.auth.token;

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

      let enrolledClassesId = [];
      let teachingClassesId = [];

      let reviewIdList = [];

      if (studentId && studentId != '') {
        if (enrolledClasses) {
          enrolledClasses.forEach((element) => {
            enrolledClassesId.push(element._id.toString());

            this.reviewService
              .getReviewIdListForStudent(studentId, element._id.toString())
              .then((response) => {
                console.log('student', response);
                if (response.length > 0) {
                  response.forEach((id) => {
                    reviewIdList.push(id);
                  });
                }
              });
          });
        }
      }

      if (teachingClasses) {
        teachingClasses.forEach((element) => {
          teachingClassesId.push(element._id.toString());

          this.reviewService
            .getReviewIdListForTeacher(element._id.toString())
            .then((response) => {
              // console.log('teacher', response);
              if (response.length > 0) {
                response.forEach((id) => {
                  reviewIdList.push(id);
                });
              }
            });
        });
      }

      await new Promise((r) => setTimeout(r, 4000));

      let myUserData = {
        studentId: studentId,
        enrolledClassesId: enrolledClassesId,
        teachingClassesId: teachingClassesId,
        reviewIdList: reviewIdList,
      };
      // this.dataMap.set(userId, myUserData);
      console.log(myUserData);

      // join all user classes and review id
      const roomNameList = [
        ...enrolledClassesId,
        ...teachingClassesId,
        ...reviewIdList,
      ];

      await client.join(roomNameList);

      // // log test
      for (const roomName of roomNameList) {
        const connectedClients = this.io.adapter.rooms.get(roomName).size ?? 0;
        console.log(`userID: ${client.id} joined room with name: ${roomName}`);
        console.log(
          `Total clients connected to room '${roomName}': ${connectedClients}`,
        );
      }
      //
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

  //test
  @SubscribeMessage('sendMessage')
  @UseGuards(WsJwtAuthGuard)
  sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('message') message: string,
    @Req() req: any,
  ) {
    this.io.on('sendMessage', ({ message }) => {});
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
    let message: string = 'A student has replied'; // "student_reply"
    if (body.message === 'grade_finalize') {
      message = 'A grade composition is finalized';
    } else if (body.message === 'review_finalize') {
      message = 'A grade review is finalized';
    } else if (body.message === 'review_create') {
      message = 'A grade review is created';
    } else if (body.message === 'teacher_reply') {
      message = 'A teacher has replied';
    }

    // only notify target class or review
    this.io.to(body.room).emit('returnNotification', message);
  }
}
