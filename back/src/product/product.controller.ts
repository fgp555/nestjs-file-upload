import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          const randomName = Date.now();
          callback(null, `${randomName}_${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype == 'image/png' ||
          file.mimetype == 'image/jpg' ||
          file.mimetype == 'image/jpeg'
        ) {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(
            new Error('Only .png, .jpg and .jpeg format allowed!'),
            false,
          );
        }
      },
    }),
  )
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.create(createProductDto, files);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }
 
  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          const randomName = Date.now();
          callback(null, `${randomName}_${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype == 'image/png' ||
          file.mimetype == 'image/jpg' ||
          file.mimetype == 'image/jpeg'
        ) {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(
            new Error('Only .png, .jpg and .jpeg format allowed!'),
            false,
          );
        }
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.update(+id, updateProductDto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
