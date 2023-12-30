// aws.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsService {
    constructor(@Inject('S3')
    private readonly s3: S3,
        private configService: ConfigService,
    ) { }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const params = {
            Bucket: this.configService.get<string>('DO_SPACES_BUCKET'),
            Key: file.filename,
            Body: file.buffer,
        };

        const { Location } = await this.s3.upload(params).promise();
        return Location;
    }

    async downloadFile(key: string): Promise<Buffer> {
        const params = {
            Bucket: this.configService.get<string>('DO_SPACES_BUCKET'),
            Key: key,
        };

        const { Body } = await this.s3.getObject(params).promise();
        return Body as Buffer;
    }
}
