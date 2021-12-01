import { PaginationParams, RoleGuard } from '@app/api/nest/utils';
import { Role } from '@app/api/shared/constances';
import { JwtTokenGuard, RequestWithUser } from '@app/authentication/shared';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtTokenGuard)
  @Get()
  currentUser(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @UseGuards(JwtTokenGuard)
  @UseGuards(RoleGuard(Role.Admin))
  @Get('all')
  getAllUser(
    @Query('search') search: string,
    @Query()
    { limit = 50, offset = 0, startId = 0 }: PaginationParams
  ) {
    console.log(offset, limit, startId);
    if (search) {
      // TODO: implement search
      return this.userService.getAllUser();
    } else {
      return this.userService.getAllUser(offset, limit, startId);
    }
  }
}
