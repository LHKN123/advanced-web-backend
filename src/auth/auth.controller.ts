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
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GoogleOauthGuard } from './guard/google-oauth.guard';
import { Response } from 'express';

import { FacebookGuard } from './guard/facebook.guard';
import { ReturnUserDto } from './dto/return_user.dto';
import { ConfigService } from '@nestjs/config';
import { StringDecoder } from 'string_decoder';
import { AuthGuard } from '@nestjs/passport';
import { BanUserDto } from './dto/ban-user.dto';
import { ImportStudentIdDto } from './dto/import_studentId.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) { }

  @Post('ban')
  @ApiOperation({ summary: 'Restricted or unrestricted account' })
  async banUser(@Body() reqBody: BanUserDto) {
    return this.authService.banUser(reqBody);
  }

  @Post('register')
  @ApiOperation({ summary: 'Create new account' })
  async register(@Body() reqBody: RegisterUserDto) {
    return this.authService.register(reqBody);
  }

  @Post('login')
  @ApiOperation({ summary: 'Sign in account' })
  @UsePipes(ValidationPipe)
  async login(@Body() reqBody: LoginUserDto) {
    return this.authService.login(reqBody);
  }

  @Post('/admin/login')
  @ApiOperation({ summary: 'Sign in admin account' })
  @UsePipes(ValidationPipe)
  async loginAdmin(@Body() reqBody: LoginUserDto) {
    return this.authService.loginAdmin(reqBody);
  }

  @Post('/admin/register')
  @ApiOperation({ summary: 'Create new admin account' })
  async registerAdmin(@Body() reqBody: RegisterUserDto) {
    return this.authService.registerAdmin(reqBody);
  }

  @Post('send-recovery-email')
  @ApiOperation({ summary: 'Send recovery email' })
  @ApiResponse({ status: 200, description: 'Send recovery email successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendRecoveryEmail(@Body() reqBody: RecoveryPasswordDto) {
    // Implement your password reset logic here
    return this.authService.sendRecoveryEmail(reqBody);
  }

  @Post('send-verification')
  @ApiOperation({ summary: 'Send verification account email' })
  @ApiResponse({
    status: 200,
    description: 'Send verification email successful',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendVerificationEmail(@Body() reqBody: RecoveryPasswordDto) {
    // Implement your password reset logic here
    return this.authService.sendVerificationEmail(reqBody);
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
  async googleLogin(@Req() _req) { }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    console.log('google', req.user);
    const auth = await this.authService.signInSocialLogin(req.user);
    return this.sendResponseSocialLogin(res, auth);

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
    const auth = await this.authService.signInSocialLogin(req.user.user);

    return this.sendResponseSocialLogin(res, auth);
  }

  async sendResponseSocialLogin(
    res: Response,
    auth: { access_token: string; refresh_token: string },
  ) {
    // const successRedirectUrl = (auth) =>
    //   `${this.configService.get<string>(
    //     'BASE_URL_FRONTEND',
    //   )}/auth/oauth-success-redirect?code=${auth.access_token}`;
    const successRedirectUrl = (auth) =>
      `${this.configService.get<string>(
        'BASE_URL_FRONTEND',
      )}/auth/oauth-success-redirect?code=${auth.access_token}`;

    try {
      const refreshTokenCookie = this.authService.getCookieRefreshToken(
        auth.refresh_token,
      );
      res.setHeader('Set-Cookie', refreshTokenCookie);
      return res.redirect(successRedirectUrl(auth));
    } catch (error) {
      return res.redirect(
        `${this.configService.get<string>('BASE_URL_FRONTEND')}/auth?error=${error.message
        }`,
      );
    }
  }

  @Get('user')
  @ApiOperation({ summary: 'Get profile info' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req: any) {
    const userId = req.user.id;
    return this.authService.getUser(userId);
  }

  @Post('import')
  @ApiOperation({ summary: 'Import studentId list from Excel ' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async createRubric(@Req() req: any, @Body() reqBody: ImportStudentIdDto) {
    return this.authService.import(reqBody);
  }
}
