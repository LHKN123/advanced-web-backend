// aws.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AWS, { S3 } from 'aws-sdk';

@Injectable()
export class AwsService {
    constructor(@Inject('S3')
    private readonly s3: S3,
        private configService: ConfigService,
    ) { }
    async uploadFile(file: Express.Multer.File): Promise<string> {
        console.error("File", file);
        const params = {
            Bucket: this.configService.get<string>('DO_SPACES_BUCKET'),
            Key: `avatar/${file.originalname}`,
            ACL: 'public-read',
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

    //Outdated, not used anymore, cuz the avatarUrl is already public
    async getAvatarUrl(key: string): Promise<any> {
        const url = this.s3.getSignedUrl('getObject', {
            Bucket: this.configService.get<string>('DO_SPACES_BUCKET'),
            Key: key,
        });
        return url;
    }
}
