import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import base64url from 'base64url';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  constructor(private configService: ConfigService) {
    super({
      // accessType: 'offline',
      // response_type: "code",
      // display: 'popup',
      // approvalPrompt: 'auto',
      prompt: 'select_account', //"consent"
    });
  }

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest() as Request;
      const state = request.query.state as string;
      if (state) {
        const json = JSON.parse(base64url.decode(state));
        request.query.from = json.from;
        request.query.return_url = json.return_url;
      }

      const from = (request.query.from as string)?.replace(/\@/g, '/');
      const return_url = encodeURI(request.query.return_url as string);
      const activate = (await super.canActivate(context)) as boolean;
      request.params.from = from;
      request.params.return_url = return_url;
      return activate;
    } catch (ex) {
      throw ex;
    }
  }
}
