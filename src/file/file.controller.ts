import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { FileService } from './file.service.js';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @HttpCode(200)
  @UseInterceptors(FilesInterceptor('files'))
  @Auth()
  @Post()
  async saveFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder: string = 'products',
  ) {
    return this.fileService.saveFiles(files, folder);
  }

  @HttpCode(200)
  @Auth()
  @Get()
  async findAllFiles(@Query('folder') folder: string = 'products') {
    return this.fileService.findAllFiles(folder);
  }

  @HttpCode(200)
  @Auth()
  @Delete()
  async deleteFile(
    @Query('folder') folder: string,
    @Query('fileName') fileName: string,
  ) {
    return this.fileService.deleteFile(folder, fileName);
  }
}
