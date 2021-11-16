import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_NOT_FOUND } from 'src/shared/constants/users.constants';
import { User } from 'src/shared/models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async getItems(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async get(id: number): Promise<User> {
    const chat = await this.userRepo.findOne(id);

    if (!chat) {
      throw new BadRequestException(USER_NOT_FOUND);
    }
    return chat;
  }
}
