import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpExceptionFilter } from './common/exception.filter';
import { Logger } from 'nestjs-pino';

export const initApp = (app: INestApplication): INestApplication => {
  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.useGlobalFilters(new HttpExceptionFilter());

  // set to default logger: pino
  app.useLogger(app.get(Logger));

  // cors
  app.enableCors();

  // version
  app.enableVersioning({
    type: VersioningType.URI,
  });

  return app;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  // Swagger Config
  const docOptions = new DocumentBuilder()
    .setTitle('Book-Learn API')
    .setVersion('MVP')
    .addBearerAuth()
    .build();

  // TODO: swagger.ts
  // const channelOptions: SwaggerDocumentOptions = {
  //   include: [UsersModule, BooksModule, BookReviewsModule],
  // };

  const doc = SwaggerModule.createDocument(app, docOptions, {});
  SwaggerModule.setup('/api', app, doc);
  await app.listen(configService.get<number>('app.port'));
}
bootstrap();
