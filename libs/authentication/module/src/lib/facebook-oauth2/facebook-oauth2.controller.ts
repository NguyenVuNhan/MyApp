import {
  FacebookOauthGuard,
  RequestWithOAuthUser,
} from '@app/authentication/shared';
import { UserService } from '@app/user/module';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { FacebookOauth2Service } from './facebook-oauth2.service';

@Controller('auth/facebook')
export class FacebookOauth2Controller {
  constructor(
    private readonly facebookOauth2Service: FacebookOauth2Service,
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService
  ) {}
  @Get()
  @UseGuards(FacebookOauthGuard)
  async googleAuth() {
    return;
  }

  @Get('redirect')
  @UseGuards(FacebookOauthGuard)
  async facebookAuthRedirect(@Req() request: RequestWithOAuthUser) {
    const user = await this.facebookOauth2Service.facebookLogin(request.user);

    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return user;
  }
}
