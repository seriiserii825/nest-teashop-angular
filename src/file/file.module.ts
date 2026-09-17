import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'app-root-path';
import { FileController } from './file.controller.js';
import { FileService } from './file.service.js';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve('uploads'),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
