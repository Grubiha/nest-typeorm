import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  // UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ZodPipe } from 'src/zod-validation/zod-validation.pipe';
import { CreateProductZod, DeleteProductZod } from './zod/zod';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DeleteProductDto } from './dto/delete-product.dto';

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

  @Delete(':id')
  @UsePipes(new ZodPipe(DeleteProductZod))
  delete(@Param() dto: DeleteProductDto) {
    return this.productsService.delete(dto);
  }
}
