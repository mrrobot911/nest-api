import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { EditUsersDto } from './dto';
import { UsersService } from './users.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Users } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get('me')
  getMe(@GetUser() user: Users) {
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUsersDto) {
    return this.userService.editUser(userId, dto);
  }
}
