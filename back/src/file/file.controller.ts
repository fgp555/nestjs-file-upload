// back/src/files/files.controller.ts

import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs_extra from 'fs-extra';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly filesService: FileService) {}

  @Get('')
  getHello(): string {
    return 'Hello Files!';
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile_Test(@UploadedFiles() files: Express.Multer.File[]) {
    console.log('files controller');
    return files;
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          const uploadPath = './uploads/files';
          await fs_extra.ensureDir(uploadPath);
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = file.originalname.split('.').pop();
          const filename = `${uniqueSuffix}.${fileExt}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @Body() body: { description?: string },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.filesService.uploadFile(body, files);
  }
}
