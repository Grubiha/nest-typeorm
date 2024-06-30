import { ApiProperty } from '@nestjs/swagger';
import { DeleteProduct } from '../zod/zod';

export class DeleteProductDto implements DeleteProduct {
  @ApiProperty()
  readonly id: string;

  constructor(data: DeleteProduct) {
    this.id = data.id;
  }
}
