import { Body, Controller, Param, Put, UseGuards, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './users.entity';
@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('username') username: string,
    @Body('email') email: string,
  ) {
    return this.usersService.updateProfile(Number(id), username, email);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }
}
