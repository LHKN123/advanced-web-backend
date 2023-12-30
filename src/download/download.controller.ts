// download.controller.ts

import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AwsService } from '../aws/aws.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('download')
@Controller('download')
export class DownloadController {
    constructor(private readonly awsService: AwsService) { }

    @Get(':key')
    async downloadFile(@Param('key') key: string, @Res() res: Response) {
        const file = await this.awsService.downloadFile(key);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=${key}`);
        res.send(file);
    }
}
