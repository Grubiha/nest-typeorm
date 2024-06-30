import { NestFactory } from '@nestjs/core';
import 'dotenv/config'; // до модулей использующих process.env
import { AppModule } from './app.module';
import { ZodExceptionFilter } from './zod-validation/zod-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT;

  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new ZodExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Nest TypeORM')
    .setDescription('описание API')
    .setVersion('1.0')
    .addTag('PRODUCTS')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT, () =>
    console.log(`Приложение запустилось на http://localhost:${PORT}`),
  );
}
bootstrap();
