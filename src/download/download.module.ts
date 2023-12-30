// download.module.ts

import { Module } from '@nestjs/common';
import { DownloadController } from './download.controller';
import { AwsModule } from 'src/aws/aws.module';
import { DownloadService } from './download.service';
import { AwsService } from 'src/aws/aws.service';

@Module({
    imports: [AwsModule],
    controllers: [DownloadController],
    providers: [DownloadService, AwsService],
})
export class DownloadModule { }
