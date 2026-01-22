import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

// Frontend (file)
//    ↓ HTTP multipart
// NestJS (Multer)
//    ↓
// file.buffer   ←––– THIS IS THE BUFFER (full file in RAM)
//    ↓ convert
// Readable Stream (streamifier)
//    ↓ pipe
// Cloudinary Writable Stream (upload_stream)
//    ↓
// Cloudinary Storage

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary: any,
  ) {}

  uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'nestjsdemo',
          resource_type: 'auto',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          if (error)
            return reject(
              new BadRequestException(
                error.message || 'Cloudinary upload failed',
              ),
            );
          resolve(result);
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<any> {
    return await this.cloudinary.uploader.destroy(publicId);
  }
}
