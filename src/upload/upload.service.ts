import { Injectable } from '@nestjs/common';
import { BufferedFile } from 'src/minio-client/file.model';
import { MinioClientService } from 'src/minio-client/minio-client.service';

@Injectable()
export class UploadService {
    constructor(
        private minioClientService: MinioClientService
    ) {}

    async uploadAvatar(image: BufferedFile) {
        let uploadAvatar = await this.minioClientService.upload(image)

        return {
            imageUrl: uploadAvatar.url,
            message: "Successfully uploaded avatar to MinIO S3"
        }
    }
}