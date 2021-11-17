import { UserModule } from '@app/user/module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { GoogleOauth2Controller } from './google-oauth2/google-oauth2.controller';
import { GoogleOauth2Service } from './google-oauth2/google-oauth2.service';
import {
  GoogleOAuthStrategy,
  JwtRefreshTokenStrategy,
  LocalStrategy,
} from './strategies';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFactorAuthController } from './two-factor-auth/two-factor-auth.controller';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Module({
  imports: [UserModule, ConfigModule, JwtModule.register({})],
  controllers: [
    AuthenticationController,
    TwoFactorAuthController,
    GoogleOauth2Controller,
  ],
  providers: [
    AuthenticationService,
    TwoFactorAuthService,
    GoogleOauth2Service,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    GoogleOAuthStrategy,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
