import { Module } from '@nestjs/common';
import { AwsController } from './aws.controller';
import { AwsService } from './aws.service';
import * as AWS from 'aws-sdk';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    controllers: [AwsController],
    providers: [
        AwsService,
        {
            provide: 'S3',
            useFactory: (configService: ConfigService) => new AWS.S3({
                endpoint: new AWS.Endpoint(configService.get<string>('DO_SPACES_URL')),
                accessKeyId: configService.get<string>('DO_SPACES_ID'),
                secretAccessKey: configService.get<string>('DO_SPACES_SECRET'),
            }),
            inject: [ConfigService],
        },
    ],
    exports: ['S3'], // Export the token for injection in other modules if needed
})
export class AwsModule { }
