import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // This tells NestJS: validate every incoming request body against its DTO
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // strip any properties not in the DTO
    forbidNonWhitelisted: true, // throw error if unknown properties are sent
    transform: true,       // auto-convert types (e.g. string "5" → number 5)
  }));


  // swagger setup 
  const config = new DocumentBuilder()
    .setTitle('Job Radar API')
    .setDescription('API for Job Radar application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();