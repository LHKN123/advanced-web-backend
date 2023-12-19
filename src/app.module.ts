import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/users.entity';
import { MinioClientModule } from './minio-client/minio-client.module';
import { UploadModule } from './upload/upload.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SocketioModule } from './socketio/socketio.module';
import { ClassesModule } from './classes/classes.module';
import { NotificationModule } from './notification/notification.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URL,
      useUnifiedTopology: true,
      // host: process.env.DO_HOST,
      // port: Number(process.env.DB_PORT),
      // username: process.env.MONGO_INITDB_ROOT_USERNAME,
      // password: process.env.MONGO_INITDB_ROOT_PASSWORD,
      // database: process.env.MONGO_INITDB_DATABASE,
      entities: [UserEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    MinioClientModule,
    UploadModule,
    SocketioModule,
    ClassesModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
