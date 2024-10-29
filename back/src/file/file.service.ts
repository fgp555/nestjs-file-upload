// back/src/files/files.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
  ) {}

  async uploadFile(
    body: { description?: string },
    files: Express.Multer.File[],
  ) {
    console.log('body: ', body);
    const savedFiles = await this.saveFilesHelper(files, body.description);
    return savedFiles;
  }

  private async saveFilesHelper(
    files: Express.Multer.File[],
    description?: string,
  ): Promise<FileEntity[]> {
    const fileEntities: FileEntity[] = files.map((file) => {
      const newFile = new FileEntity();
      newFile.path = file.path;
      newFile.description = description || ''; // Asigna la descripción o una cadena vacía si no se proporciona
      return newFile;
    });
    return this.filesRepository.save(fileEntities);
  }
}
