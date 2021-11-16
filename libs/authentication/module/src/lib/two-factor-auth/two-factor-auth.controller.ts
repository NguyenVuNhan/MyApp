import {
  JwtTokenGuard,
  RequestWithUser,
  TwoFactorAuthCodeDto,
} from '@app/authentication/shared';
import { UserService } from '@app/user/module';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from '../authentication.service';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Controller('auth/2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService
  ) {}

  @HttpCode(200)
  @UseGuards(JwtTokenGuard)
  @Post('authenticate')
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthCodeDto
  ) {
    const isCodeValid =
      this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        request.user
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(
        request.user.id,
        true
      );

    request.res.setHeader('Set-Cookie', [accessTokenCookie]);

    return request.user;
  }

  @HttpCode(200)
  @UseGuards(JwtTokenGuard)
  @Post('enable')
  async turnOnTwoFactorAuthentication(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthCodeDto
  ) {
    const isCodeValid =
      this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        request.user
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.userService.enable2fa(request.user.id);
  }

  @HttpCode(200)
  @UseGuards(JwtTokenGuard)
  @Post('disable')
  async turnOff(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthCodeDto
  ) {
    const isCodeValid =
      this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        request.user
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.userService.enable2fa(request.user.id, false);
  }

  @UseGuards(JwtTokenGuard)
  @Get('generate')
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
    const { otpauthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(
        request.user
      );

    return this.twoFactorAuthService.pipeQrCodeStream(response, otpauthUrl);
  }
}
