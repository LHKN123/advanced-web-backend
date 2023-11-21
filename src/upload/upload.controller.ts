import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';

@Controller('upload')
export class UploadController {
    constructor(
        private uploadService: UploadService
    ) {}

    @Post('avatar')
    @UseInterceptors(FileInterceptor('image'))
    async uploadAvatar(
        @UploadedFile() image: BufferedFile
    ) {
        return await this.uploadService.uploadAvatar(image);
    }
}