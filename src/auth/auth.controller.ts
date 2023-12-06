import {
  Controller,
  Post,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  Body,
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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @Post('send-verification')
  @ApiOperation({ summary: 'Send verification account email' })
  @ApiResponse({ status: 200, description: 'Send verification email successful' })
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
}
