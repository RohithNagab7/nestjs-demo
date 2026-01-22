import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/upload-file.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('file')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadedFile: FileUploadDto,
    @CurrentUser() user: User,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file found');
    }

    return this.fileUploadService.uploadFile(
      file,
      uploadedFile.description,
      user,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.fileUploadService.findAll();
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteFile(@Param('id', ParseUUIDPipe) id: number) {
    await this.fileUploadService.deleteFile(id);
    return {
      message: 'File deleted successfully',
    };
  }
}
