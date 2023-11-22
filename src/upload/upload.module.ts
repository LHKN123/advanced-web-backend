import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MinioClientModule } from 'src/minio-client/minio-client.module';

@Module({
  imports: [ 
    MinioClientModule
  ],
  providers: [UploadService],
  controllers: [UploadController]
})
export class UploadModule {}
