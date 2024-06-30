import { ApiProperty } from '@nestjs/swagger';
import { CreateProduct } from '../zod/zod';

export class CreateProductDto implements CreateProduct {
  @ApiProperty()
  readonly title: string;
  @ApiProperty()
  readonly description?: string;
  @ApiProperty()
  readonly price: number;

  constructor(data: CreateProduct) {
    this.title = data.title;
    this.description = data.description;
    this.price = data.price;
  }
}
