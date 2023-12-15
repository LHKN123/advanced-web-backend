import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export class WsJwtAuthGuard extends AuthGuard('ws-jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const publicKey = this.configService.get<string>('EXP_IN_REFRESH_TOKEN');

      const token = client.handshake.auth.token;

      this.jwtService.verifyAsync(token, { secret, publicKey });
      return super.canActivate(new ExecutionContextHost([client]));
    } catch (err) {
      client.disconnect(true);
      throw err;
    }
  }
}
