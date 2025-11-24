// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Allow dev Vite origin and local same-origin (when serving frontend from backend)
  app.enableCors({
    origin: true,
    credentials: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Library Borrowing API')
    .setDescription('API untuk sistem perpustakaan (books, members, loans, fines)')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Serve frontend static files (built Vite app)
  const frontendDist = join(__dirname, '..', '..', 'frontend', 'dist');
  const server = app.getHttpAdapter().getInstance();
  server.use(express.static(frontendDist));

  // SPA fallback: for non-API GET requests that accept HTML, return index.html
  server.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    if (req.method !== 'GET') return next();
    const accept = (req.headers && req.headers.accept) || '';
    if (accept.includes('text/html')) {
      return res.sendFile(join(frontendDist, 'index.html'));
    }
    return next();
  });

  await app.listen(3000);
  console.log(`Server running on http://localhost:8080`);
  console.log(`Swagger docs: http://localhost:3000/api/docs`);
}
bootstrap();
