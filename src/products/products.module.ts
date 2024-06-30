import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './db-entity/product.entity';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), FilesModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
