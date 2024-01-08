import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ImATeapotException, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import passport from 'passport';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const clientPort = parseInt(configService.get('CLIENT_PORT'));
  const appPort = parseInt(configService.get('APP_PORT'));

  const corsOptions: CorsOptions = {
    // origin: true,
    origin: [
      `http://localhost:${clientPort}`,
      new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      configService.get<string>('BASE_URL_FRONTEND'),
      "https://advanced-web-frontend-lbh2r91gm-light-hub.vercel.app/"

    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);
  // app.use(function (req, res, next) {
  //   res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  //   res.header(
  //     'Access-Control-Allow-Headers',
  //     'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  //   );
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   res.header(
  //     'Access-Control-Allow-Methods',
  //     'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS',
  //   );

  //   if (req.method === 'OPTIONS') {
  //     res.status(200).end();
  //   } else {
  //     next();
  //   }
  // });

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

  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  await app.listen(appPort);
}
bootstrap();
