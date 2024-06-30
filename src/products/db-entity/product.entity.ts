import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../zod/zod';
// import { Product } from '../dto/zod/zod';

@Entity({ name: 'products' })
export class ProductEntity implements Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  price: number;

  @Column({ type: 'simple-array' })
  images: string[];

  // to-do
  // order
  // create at
  // update at
}

// type Product = typeof ProductEntity;
