import { Module, forwardRef } from '@nestjs/common';
import { SocketioGateway } from './socketio.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { WsJwtStrategy } from './strategies/ws-jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { WsJwtAuthGuard } from './guard/ws-jwt.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => AuthModule), UsersModule, ConfigModule, JwtModule],
  providers: [SocketioGateway, WsJwtStrategy, WsJwtAuthGuard],
  exports: [SocketioGateway],
})
export class SocketioModule {}
