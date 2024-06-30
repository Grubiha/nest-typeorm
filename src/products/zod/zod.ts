import { z } from 'zod';

export const ZodProduct = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1),
  description: z.string(),
  price: z.coerce.number().positive(),
  images: z.string().array(),
});

export type Product = z.infer<typeof ZodProduct>;

export const CreateProductZod = ZodProduct.pick({
  title: true,
  description: true,
  price: true,
}).partial({ description: true });
export type CreateProduct = z.infer<typeof CreateProductZod>;
