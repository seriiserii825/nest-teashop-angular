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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { FileService } from './file.service.js';

const fileResponseSchema = {
  type: 'array' as const,
  items: {
    type: 'object' as const,
    properties: {
      url: { type: 'string' },
      name: { type: 'string' },
    },
  },
};

@ApiTags('file')
@ApiBearerAuth()
@Auth()
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: 'Upload files to a folder' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'folder', required: false })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Files uploaded successfully.', schema: fileResponseSchema })
  @HttpCode(200)
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  async saveFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder: string = 'products',
  ) {
    return this.fileService.saveFiles(files, folder);
  }

  @ApiOperation({ summary: 'List files in a folder' })
  @ApiQuery({ name: 'folder', required: false })
  @ApiOkResponse({ description: 'List of files.', schema: fileResponseSchema })
  @HttpCode(200)
  @Get()
  async findAllFiles(@Query('folder') folder: string = 'products') {
    return this.fileService.findAllFiles(folder);
  }

  @ApiOperation({ summary: 'Delete a file from a folder' })
  @ApiQuery({ name: 'folder', required: true })
  @ApiQuery({ name: 'fileName', required: true })
  @ApiOkResponse({ description: 'File deleted successfully.', type: String })
  @HttpCode(200)
  @Delete()
  async deleteFile(
    @Query('folder') folder: string,
    @Query('fileName') fileName: string,
  ) {
    return this.fileService.deleteFile(folder, fileName);
  }
}
