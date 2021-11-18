import { OAuthUser } from '@app/authentication/shared';
import { UserService } from '@app/user/module';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FacebookOauth2Service {
  constructor(private readonly userService: UserService) {}

  async facebookLogin(user: Omit<OAuthUser, 'email'>) {
    if (!user) {
      throw new NotFoundException('No user from facebook');
    }

    const findUser = await this.userService.getByNameOrEmail(user.name);

    if (findUser) {
      return findUser;
    }

    await this.userService.createWithoutEmail({
      ...user,
      // Password will be empty, this is allowed since we check for the user password
      // length when they try to login with password and the password with length 0
      // is never accepted
      password: '',
      cPassword: '',
    });
  }
}
