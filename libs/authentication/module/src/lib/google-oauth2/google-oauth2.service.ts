import { OAuthUser } from '@app/authentication/shared';
import { UserService } from '@app/user/module';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GoogleOauth2Service {
  constructor(private readonly userService: UserService) {}

  async googleLogin(user: OAuthUser) {
    if (!user) {
      throw new NotFoundException('No user from google');
    }

    const findUser = await this.userService.getByEmail(user.email);

    if (findUser) {
      return findUser;
    }

    await this.userService.create({
      ...user,
      // Password will be empty, this is allowed since we check for the user password
      // length when they try to login with password and the password with length 0
      // is never accepted
      password: '',
      cPassword: '',
    });
  }
}
