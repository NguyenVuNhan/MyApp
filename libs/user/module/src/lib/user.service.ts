import { CreateUserDto, User } from '@app/user/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getById(id: number) {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new NotFoundException('User with this id does not exist');
  }

  async setRefreshToken(token: string, userId: number) {
    const refreshToken = await bcrypt.hash(token, 10);
    await this.userRepository.update(userId, { refreshToken });
  }

  async removeRefreshToken(userId: number) {
    return this.userRepository.update(userId, { refreshToken: null });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async enable2fa(userId: number, isEnabled = true) {
    await this.userRepository.update(userId, { enabled2fa: isEnabled });
  }

  async set2faSecret(userId: number, secret: string) {
    await this.userRepository.update(userId, { secret2fa: secret });
  }
}
