import {
  Controller,
  Post,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  HttpStatus,
  Req,
  Res,
  Redirect,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GoogleOauthGuard } from './guard/google-oauth.guard';
import { Response } from 'express';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { FacebookGuard } from './guard/facebook.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Create new account' })
  async register(@Body() reqBody: RegisterUserDto) {
    console.log('register controller', reqBody);
    return this.authService.register(reqBody);
  }

  @Post('login')
  @ApiOperation({ summary: 'Sign in account' })
  @UsePipes(ValidationPipe)
  async login(@Body() reqBody: LoginUserDto) {
    return this.authService.login(reqBody);
  }
  
  @Post('send-recovery-email')
  @ApiOperation({ summary: 'Send recovery email' })
  @ApiResponse({ status: 200, description: 'Send recovery email successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendRecoveryEmail(@Body() reqBody: RecoveryPasswordDto) {
    // Implement your password reset logic here
    return this.authService.sendRecoveryEmail(reqBody);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Update password for user' })
  async resetPassword(@Body() reqBody: ResetPasswordDto) {
    // Implement your password reset logic here
    return this.authService.resetPassword(reqBody);
  }


  @Post('refresh-token')
  @ApiOperation({ summary: 'Get new refresh token' })
  refreshToken(@Body() reqBody: RefreshTokenDto): Promise<any> {
    return this.authService.refreshToken(reqBody.refresh_token);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleLogin(@Req() _req) {
    console.log('google login');
  }

  // @Get('google/callback')
  // @UseGuards(GoogleOauthGuard)
  // async googleAuthCallback(@Req() req, @Res() res: Response) {
  //   console.log('USER', req.user);

  //   const user = await this.authService.signInSocialLogin(req.user);
  //   return res.redirect('http://localhost:3000');
  //   // res.cookie('access_token', token, {
  //   //   maxAge: 2592000000,
  //   //   sameSite: true,
  //   //   secure: false,
  //   // });
  // }

  // @Get('google/callback')
  // @UseGuards(GoogleOauthGuard)
  // async googleAuthCallback(@Req() req, @Res() res: Response) {
  //   const user = await this.authService.signInSocialLogin(req.user);

  //   // Gửi thông tin người dùng qua WebSocket
  //   this.appGateway.server.emit('userInfo', user);

  //   // Redirect về trang frontend (thay đổi URL tùy ý)
  //   //res.redirect('http://localhost:3000');
  // }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    console.log('USER', req.user);

    const user = await this.authService.signInSocialLogin(req.user);

    // Send user data to connected clients via WebSocket
    this.websocketGateway.server.emit('login', user);

    return res.redirect('http://localhost:3000');
  }

  @Get('/facebook')
  @UseGuards(FacebookGuard)
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/callback')
  @UseGuards(FacebookGuard)
  async facebookLoginRedirect(@Req() req, @Res() res): Promise<void> {
    console.log('USER', req.user);
    const user = await this.authService.signInSocialLogin(req.user.user);

    return res.redirect('http://localhost:3000');
  }
}
