import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  create(createProductDto: CreateProductDto, files: Express.Multer.File[]) {
    const imageUrls = files.map((file) => join('uploads', file.filename));

    const product = this.productRepository.create({
      ...createProductDto,
      images: imageUrls,
    });

    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    files: Express.Multer.File[],
  ) {
    const existingProduct = await this.productRepository.findOne({ where: { id } });

    if (!existingProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }

    const updatedImages = files.length > 0 ? files.map((file) => join('uploads', file.filename)) : existingProduct.images;
    const updatedProduct = {
      ...existingProduct,
      ...updateProductDto,
      images: updatedImages,
    };

    return this.productRepository.save(updatedProduct);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
