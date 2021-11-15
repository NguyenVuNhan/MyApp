import { UserService } from '@app/user/module';
import { CreateUserDto } from '@app/user/shared';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from '@app/api/shared/constances';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userService: UserService) {}

  public async register(registrationData: CreateUserDto) {
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
      console.log(error);

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
