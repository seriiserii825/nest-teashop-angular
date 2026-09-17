import { Injectable } from '@nestjs/common';
import { IFileResponse } from './interfaces/IFileResponse.js';
import path from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class FileService {
  async saveFiles(
    files: Express.Multer.File[],
    folder: string = 'products',
  ): Promise<IFileResponse[]> {
    const uploadedFolder = `${path.resolve('uploads')}/${folder}`;
    await ensureDir(uploadedFolder);

    const response: IFileResponse[] = await Promise.all(
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
}
