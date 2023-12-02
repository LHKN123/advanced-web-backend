import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SocketIoAdapter } from './socketio-adapter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // dotenv.config();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const clientPort = parseInt(configService.get('CLIENT_PORT'));
  const appPort = parseInt(configService.get('APP_PORT'));

  const corsOptions: CorsOptions = {
    // origin: true,
    origin: [
      `http://localhost:${clientPort}`,
      new RegExp(
        `/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`,
      ).toString(),
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.useWebSocketAdapter(new SocketIoAdapter(app, configService));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Lighthub')
    .setDescription('The Lighthub API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(appPort);
}
bootstrap();
