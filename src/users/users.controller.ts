import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './users.entity';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('profile')
@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Put('update')
  @ApiOperation({ summary: 'Update profile info' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async update(@Req() req: any, @Body() reqBody: UpdateProfileDto) {
    const userId = req.user.id;
    return this.usersService.updateProfile(
      userId,
      reqBody.username,
      reqBody.studentId,
    );
  }

  @Get('')
  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async getAllUsers(@Req() req: any) {
    return this.usersService.getAllUsers();
  }
  // @Get('user')
  // @ApiOperation({ summary: 'Update profile info' })
  // @ApiBearerAuth('access-token')
  // @UseGuards(AuthGuard('jwt'))
  // async getUser(@Req() req: any) {
  //   const userId = req.user.id;
  //   return this.usersService.getUserById(userId);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<UserEntity> {
  //   return this.usersService.findOne(id);
  // }
}
