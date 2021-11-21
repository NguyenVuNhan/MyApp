import { PostgresErrorCode } from '@app/api/shared/constances';
import { TokenPayload } from '@app/authentication/shared';
import { UserService } from '@app/user/module';
import { CreateUserDto } from '@app/user/shared';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import console = require('console');

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async register(registrationData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.userService.create({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('User with that email already exists');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getAuthenticatedUser(nameOrEmail: string, password: string) {
    const user = await this.userService.getByNameOrEmail(nameOrEmail);
    if (!user) throw new NotFoundException('User not found');

    try {
      await this.verifyPassword(password, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  public getCookieWithJwtAccessToken(
    userId: number,
    isSecondFactorAuthenticated = false
  ) {
    const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
    const jwtAccessTokenExpirationTime = this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
    );
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: jwtAccessTokenExpirationTime + 's',
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtAccessTokenExpirationTime}`;
  }

  public getCookieWithJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const jwtRefreshTokenExpirationTime = this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
    );
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: jwtRefreshTokenExpirationTime + 's',
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${jwtRefreshTokenExpirationTime}`;
    return {
      cookie,
      token,
    };
  }

  public getCookieForLogOut() {
    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }
}
