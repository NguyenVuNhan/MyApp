import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyFunction } from 'passport-facebook';

@Injectable()
export class FacebookOAuthStrategy extends PassportStrategy(
  Strategy,
  'facebook'
) {
  constructor(readonly configService: ConfigService) {
    super({
      clientID: configService.get('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get('FACEBOOK_CLIENT_SECRET'),
      callbackURL: `${configService.get(
        'BASE_URL'
      )}/api/auth/facebook/redirect`,
    });
  }

  validate: VerifyFunction = async (
    _accessToken,
    _refreshToken,
    profile,
    done
  ) => {
    const { displayName } = profile;
    const user = {
      name: displayName.normalize('NFC'),
    };

    done(null, user);
  };
}
