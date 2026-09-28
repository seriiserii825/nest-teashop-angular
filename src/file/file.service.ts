import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageResponseDto } from '../common/dto/message-response.dto.js';
import { FileResponseDto } from './dto/file-response.dto.js';
import path from 'app-root-path';
import fsExtra from 'fs-extra';

const { ensureDir, writeFile } = fsExtra;

@Injectable()
export class FileService {
  async saveFiles(
    files: Express.Multer.File[],
    folder: string = 'products',
  ): Promise<FileResponseDto[]> {
    const uploadedFolder = `${path.resolve('uploads')}/${folder}`;
    await ensureDir(uploadedFolder);

    const response: FileResponseDto[] = await Promise.all(
      files.map(async (file) => {
        const originalName = `${Date.now()}-${file.originalname}`;
        await writeFile(`${uploadedFolder}/${originalName}`, file.buffer);
        return {
          url: `/uploads/${folder}/${originalName}`,
          name: originalName,
        };
      }),
    );
    return response;
  }

  async findAllFiles(folder: string = 'products'): Promise<FileResponseDto[]> {
    const uploadedFolder = `${path.resolve('uploads')}/${folder}`;
    await ensureDir(uploadedFolder);

    const files = await fsExtra.readdir(uploadedFolder);
    const response: FileResponseDto[] = files.map((file) => ({
      url: `/uploads/${folder}/${file}`,
      name: file,
    }));
    return response;
  }

  async deleteFile(folder: string, fileName: string): Promise<MessageResponseDto> {
    const filePath = `${path.resolve('uploads')}/${folder}/${fileName}`;
    const fileExists = await fsExtra.pathExists(filePath);
    if (!fileExists) {
      throw new NotFoundException(
        `File ${fileName} does not exist in folder ${folder}`,
      );
    }
    await fsExtra.remove(filePath);
    return { message: `File ${fileName} deleted successfully from folder ${folder}` };
  }

  // Best-effort удаление по url вида /uploads/{folder}/{fileName} — не падает,
  // если файла уже нет (используется при каскадном удалении, например товара)
  async deleteFileByUrl(url: string): Promise<void> {
    const match = url.match(/\/uploads\/([^/]+)\/([^/]+)$/);
    if (!match) return;

    const [, folder, fileName] = match;
    const filePath = `${path.resolve('uploads')}/${folder}/${fileName}`;
    await fsExtra.remove(filePath);
  }
}
