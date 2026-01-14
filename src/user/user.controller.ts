import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserContoller {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUser() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

  @Get('/welcomemessage/:id')
  getUserWelcome(@Param('id') id: string) {
    return this.userService.getUserWelcome(+id);
  }
}
