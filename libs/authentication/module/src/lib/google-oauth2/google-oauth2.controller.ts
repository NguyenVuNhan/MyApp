import {
  GoogleOauthGuard,
  RequestWithOAuthUser,
} from '@app/authentication/shared';
import { UserService } from '@app/user/module';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { GoogleOauth2Service } from './google-oauth2.service';

@Controller('auth/google')
@UseInterceptors(ClassSerializerInterceptor)
export class GoogleOauth2Controller {
  constructor(
    private readonly googleOauth2Service: GoogleOauth2Service,
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService
  ) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    return;
  }

  @Get('redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() request: RequestWithOAuthUser) {
    const user = await this.googleOauth2Service.googleLogin(request.user);

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
