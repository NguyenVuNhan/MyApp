import { JwtTokenGuard, RequestWithUser } from '@app/authentication/shared';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  @UseGuards(JwtTokenGuard)
  @Get()
  currentUser(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }
}
