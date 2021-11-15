import { CreateUserDto, User } from '@app/user/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async create(user: CreateUserDto) {
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(user);
    return newUser;
  }

  async getByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async setRefreshToken(token: string, userId: number) {
    const refreshToken = await bcrypt.hash(token, 10);
    await this.userRepository.update(userId, {
      refreshToken,
    });
  }
}
