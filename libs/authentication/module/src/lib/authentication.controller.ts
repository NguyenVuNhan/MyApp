import { CreateUserDto } from '@app/user/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.authenticationService.register(user);
  }
}
