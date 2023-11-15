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
@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Put('update')
  // @UseGuards(AuthGuard('jwt'))
  // async update(
  //   @Req() req: Request,
  //   @Body('username') username: string,
  //   @Body('email') email: string,
  // ) {
  //   // const userId = req.user.id;
  //   // Gọi phương thức cập nhật profile từ service
  //   // return this.usersService.updateProfile(Number(userId), username, email);
  // }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }
}
