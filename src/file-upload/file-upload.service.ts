import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly cloudinaryServie: CloudinaryService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    description: string,
    user: User,
  ): Promise<File> {
    const cloudinaryResponse = await this.cloudinaryServie.uploadFile(file);
    const newlyCreatedFile = this.fileRepository.create({
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      publicId: cloudinaryResponse.public_id,
      url: cloudinaryResponse.url,
      description,
      uploader: user,
    });

    return this.fileRepository.save(newlyCreatedFile);
  }

  async findAll(): Promise<File[]> {
    const fileData = await this.fileRepository.find({
      relations: ['uploader'],
      order: { createdAt: 'DESC' },
    });

    return fileData;
  }

  async deleteFile(id: number): Promise<string> {
    const fileToBeDeleted = await this.fileRepository.findOne({
      where: { id },
    });

    if (!fileToBeDeleted) {
      throw new NotFoundException(`File with the Id: ${id}, not found`);
    }

    await this.cloudinaryServie.deleteFile(fileToBeDeleted.publicId);

    await this.fileRepository.remove(fileToBeDeleted);

    return `File: ${fileToBeDeleted.originalName} deleted.`;
  }
}
