import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
  // UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ZodPipe } from 'src/zod-validation/zod-validation.pipe';
import { CreateProductZod } from './zod/zod';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('PRODUCTS')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @ApiOperation({ summary: 'Get products' })
  @Get()
  async getAll() {
    return {
      categories: await this.productsService.getAll(),
    };
  }

  @ApiOperation({ summary: 'Create Product' })
  @UseInterceptors(FilesInterceptor('images', 10))
  @Post()
  // @UsePipes()
  async create(
    @Body(new ZodPipe(CreateProductZod)) dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return {
      category: await this.productsService.create(dto, files),
    };
  }
}
