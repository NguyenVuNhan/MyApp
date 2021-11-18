import { User } from '@app/api/shared/type-orm';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'nameOrEmail',
    });
  }
  async validate(nameOrEmail: string, password: string): Promise<User> {
    return this.authenticationService.getAuthenticatedUser(
      nameOrEmail,
      password
    );
  }
}
