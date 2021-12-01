import { NORMALIZE_TYPE } from '@app/api/shared/constances';
import { User } from '@app/api/shared/type-orm';
import { CreateUserDto } from '@app/user/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindManyOptions, MoreThan, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async getAllUser(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<User>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.userRepository.count();
    }

    const [items, count] = await this.userRepository.findAndCount({
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
      where,
    });

    return {
      items,
      count: startId ? separateCount : count,
    };
  }

  create(user: CreateUserDto) {
    return this.createWithoutEmail(user);
  }

  async createWithoutEmail(user: Omit<CreateUserDto, 'email'>) {
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(user);
    return newUser;
  }

  async getByNameOrEmail(nameOrEmail: string) {
    const data = nameOrEmail.normalize(NORMALIZE_TYPE);
    return this.userRepository.findOne({
      where: [{ email: data }, { name: data }],
    });
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
