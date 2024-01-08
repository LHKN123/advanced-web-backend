import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { AwsModule } from 'src/aws/aws.module';
import { AwsService } from 'src/aws/aws.service';

@Module({
  imports: [
    AwsModule
  ],
  providers: [UploadService, AwsService],
  controllers: [UploadController]
})
export class UploadModule { }
