import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useWebSocketAdapter(new WsAdapter(app));
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
        frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        connectSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        defaultSrc: [`'self'`, 'localhost:8080'],
      },
    },
  }));
  app.useGlobalFilters(new ValidationExceptionFilter());
  app.enableCors();
    
  await app.listen(8080);
}
bootstrap();
