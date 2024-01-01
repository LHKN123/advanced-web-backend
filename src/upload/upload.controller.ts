import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';
import { AwsService } from '../aws/aws.service';

@Controller('upload')
export class UploadController {
    constructor(
        private uploadService: UploadService,
        private readonly awsService: AwsService,
    ) { }

    @Post('avatar')
    @UseInterceptors(FileInterceptor('image'))
    async uploadAvatar(
        @UploadedFile() image: BufferedFile
    ) {
        return await this.uploadService.uploadAvatar(image);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const location = await this.awsService.uploadFile(file);
        return { location };
    }
}