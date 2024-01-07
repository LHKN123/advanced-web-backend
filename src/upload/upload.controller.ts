import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';
import { AwsService } from '../aws/aws.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
    constructor(
        private uploadService: UploadService,
        private readonly awsService: AwsService,
    ) { }

    // @Post('avatar')
    // @UseInterceptors(FileInterceptor('image'))
    // async uploadAvatar(
    //     @UploadedFile() image: BufferedFile
    // ) {
    //     return await this.uploadService.uploadAvatar(image);
    // }

    @Post('avatar')
    @UseInterceptors(FileInterceptor('file'))
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log('Uploading file:', file);
        const location = await this.awsService.uploadFile(file);
        return { location };
    }
}