import { Role } from '@app/api/shared/constances';
import { User } from '@app/api/shared/type-orm';
import { JwtTokenGuard, RequestWithUser } from '@app/authentication/shared';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleGuard } from '@app/api/nest/utils';
import { Repository } from 'typeorm';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @UseGuards(JwtTokenGuard)
  @Get()
  currentUser(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @UseGuards(JwtTokenGuard)
  @UseGuards(RoleGuard(Role.Admin))
  @Get('all')
  getAllUser() {
    return this.userRepository.find();
  }
}
