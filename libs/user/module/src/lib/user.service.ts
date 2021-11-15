import { CreateUserDto, User } from '@app/user/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
