import { UserModule } from '@app/user/module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtRefreshTokenStrategy, LocalStrategy } from './strategies';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFactorAuthController } from './two-factor-auth/two-factor-auth.controller';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Module({
  imports: [UserModule, ConfigModule, JwtModule.register({})],
  controllers: [AuthenticationController, TwoFactorAuthController],
  providers: [
    AuthenticationService,
    TwoFactorAuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
