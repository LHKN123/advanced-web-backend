import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './users.entity';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { AwsService } from 'src/aws/aws.service';
import { S3 } from 'aws-sdk';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule, AwsModule],
  controllers: [UsersController],
  providers: [UsersService, AwsService, S3],
  exports: [UsersService],
})
export class UsersModule { }
