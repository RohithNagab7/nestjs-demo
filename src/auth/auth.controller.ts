import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { RequestWithUser } from './interface/jwt.interface';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { RolesGuard } from './guards/roles.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  registerUser(@Body() registeredUser: RegisterDto) {
    return this.authService.registerUser(registeredUser);
  }

  @Post('login')
  loginUser(@Body() loggedInUser: LoginDto) {
    return this.authService.loginUser(loggedInUser);
  }

  @Post('refreshtoken')
  refreshToken(@Body('refreshtoken') refreshtoken: string) {
    return this.authService.refreshToken(refreshtoken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: RequestWithUser) {
    return {
      sub: user?.sub, // or whatever your payload structure is
      role: user?.role,
      name: user?.name,
    };
  }

  @Post('registeradmin')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  registerAdmin(@Body() registeredAdmin: RegisterDto) {
    return this.authService.registerAdmin(registeredAdmin);
  }
}
