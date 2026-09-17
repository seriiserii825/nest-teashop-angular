import { Injectable, NotFoundException } from '@nestjs/common';
import { IFileResponse } from './interfaces/IFileResponse.js';
import path from 'app-root-path';
import fsExtra from 'fs-extra';

const { ensureDir, writeFile } = fsExtra;

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

  async findAllFiles(folder: string = 'products'): Promise<IFileResponse[]> {
    const uploadedFolder = `${path.resolve('uploads')}/${folder}`;
    await ensureDir(uploadedFolder);

    const files = await fsExtra.readdir(uploadedFolder);
    const response: IFileResponse[] = files.map((file) => ({
      url: `/uploads/${folder}/${file}`,
      name: file,
    }));
    return response;
  }

  async deleteFile(folder: string, fileName: string): Promise<string> {
    const filePath = `${path.resolve('uploads')}/${folder}/${fileName}`;
    const fileExists = await fsExtra.pathExists(filePath);
    if (!fileExists) {
      throw new NotFoundException(
        `File ${fileName} does not exist in folder ${folder}`,
      );
    }
    await fsExtra.remove(filePath);
    const response = `File ${fileName} deleted successfully from folder ${folder}`;
    return response;
  }
}
