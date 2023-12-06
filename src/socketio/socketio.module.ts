import { Module, forwardRef } from '@nestjs/common';
import { SocketioGateway } from './socketio.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { WsJwtStrategy } from './strategies/ws-jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { WsJwtAuthGuard } from './guard/ws-jwt.guard';

@Module({
  imports: [forwardRef(() => AuthModule), UsersModule],
  providers: [SocketioGateway, WsJwtStrategy, WsJwtAuthGuard],
  exports: [SocketioGateway],
})
export class SocketioModule {}
