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

  @Post('refresh-token')
  @ApiOperation({ summary: 'Get new refresh token' })
  refreshToken(@Body() reqBody: RefreshTokenDto): Promise<any> {
    return this.authService.refreshToken(reqBody.refresh_token);
  }
}
