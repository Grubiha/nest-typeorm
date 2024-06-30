import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
// import { randomUUID } from 'crypto';
import { access, mkdir, unlink, writeFile } from 'fs/promises';
import * as path from 'path';
import * as sharp from 'sharp';
import { v4 } from 'uuid';

@Injectable()
export class FilesService {
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const folder = fileUrl.split('/')[1];
      const fileName = fileUrl.split('/')[2];
      const filePath = path.resolve(__dirname, '..', '..', 'static', folder);
      await unlink(path.join(filePath, fileName));
    } catch (err) {
      throw new InternalServerErrorException('Oшибка при удалении файла');
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const type = file.originalname.split('.')[1];
    const filePath = path.resolve(__dirname, '..', '..', 'static', type);
    try {
      await access(filePath);
    } catch (e) {
      await mkdir(filePath, { recursive: true });
    }

    try {
      await writeFile(path.join(filePath, file.originalname), file.buffer);
    } catch (err) {
      throw new InternalServerErrorException('Oшибка при записи файла');
    }

    return `/${type}/${file.originalname}`;
  }

  private async convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }

  async imageFilter(file: Express.Multer.File): Promise<Express.Multer.File> {
    const mimetype = file.mimetype;
    const currentFileType = file.mimetype.split('/')[1];
    const newName = v4();
    // const type = file.originalname.split('.')[1];

    if (mimetype.includes('image')) {
      if (currentFileType != 'svg+xml') {
        const buffer = await this.convertToWebP(file.buffer);
        return {
          ...file,
          buffer,
          originalname: `${newName}.webp`,
        };
      }
      return {
        ...file,
        originalname: `${newName}.svg`,
      };
    }
    throw new BadRequestException('Файл должен быть изображением');
    // return {...file, originalname: `${newName}.${type}`})
  }
}
