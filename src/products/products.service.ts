import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './db-entity/product.entity';
import { Repository } from 'typeorm';
import { Product } from './zod/zod';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesService } from 'src/files/files.service';
import { DeleteProductDto } from './dto/delete-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private repo: Repository<ProductEntity>,
    private filesService: FilesService,
  ) {}

  async create(
    dto: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<Product> {
    const foundProduct = await this.repo.findOneBy({ title: dto.title });
    if (foundProduct)
      throw new BadRequestException('Продукт с таким названием уже существует');
    const imageFiles = await Promise.all(
      files.map(
        (file): Promise<Express.Multer.File> =>
          this.filesService.imageFilter(file),
      ),
    );
    const images = await Promise.all(
      imageFiles.map(
        (file): Promise<string> => this.filesService.saveFile(file),
      ),
    );
    const Product = await this.repo.save({ ...dto, images });
    return Product;
  }

  async getAll(): Promise<Product[]> {
    return this.repo.find();
  }

  async delete(dto: DeleteProductDto) {
    const product = await this.repo.findOneBy(dto);
    if (!product) throw new NotFoundException('Продукт не найден');
    await Promise.all(
      product.images.map((url) => this.filesService.deleteFile(url)),
    );
    await this.repo.delete(dto);
    return { massage: 'success' };
  }
}
