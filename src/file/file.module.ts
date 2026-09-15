import { Module } from '@nestjs/common';
import { FileService } from './file.service.js';
import { FileController } from './file.controller.js';

@Module({
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
