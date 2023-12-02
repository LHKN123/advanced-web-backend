import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIoAdapter.name);

  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const clientPort = parseInt(this.configService.get('CLIENT_PORT'));

    const cors = {
      origin: [
        `http//localhost:${clientPort}`,
        new RegExp(
          `/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`,
        ).toString(),
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    };

    this.logger.log('Configuring SocketIo server with custom CORS options', {
      cors,
    });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    return super.createIOServer(port, optionsWithCORS);
  }
}
