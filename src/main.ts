import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { readFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: readFileSync(
        '/home/jplop/Documents/Hackthon/Hackathon_Digitaly/certs/digitaly-key.pem',
      ),
      cert: readFileSync(
        '/home/jplop/Documents/Hackthon/Hackathon_Digitaly/certs/digitaly.pem',
      ),
    },
  });

  //ativa CORS
  app.enableCors();
  // Ativa as validações dos DTOs
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  
}
await bootstrap();
