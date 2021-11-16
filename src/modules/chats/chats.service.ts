import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import { USER_NOT_FOUND } from 'src/shared/constants/users.constants';
import { User } from 'src/shared/models/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Chat } from './chat.entity';
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private charRepo: Repository<Chat>,
    private readonly userRepo: UsersService,
  ) {}

  async create(chatDto: ChatDto, user: User): Promise<Chat> {
    const data = classToPlain(chatDto);
    const createdChat = this.charRepo.create({
      ...plainToClass(Chat, data),
      created_by: user,
    });
    await this.charRepo.save(createdChat);
    return createdChat;
  }

  async update(id: number, chatDto: ChatDto) {
    const findedChat = await this.charRepo.findOne(id, {
      relations: ['users'],
    });

    if (!findedChat) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    const data = classToPlain(chatDto);
    const updatedChat = await this.charRepo.save({
      id,
      ...findedChat,
      ...plainToClass(Chat, data),
      users: findedChat.users.concat(chatDto.users),
    });

    return await this.charRepo.findOne(id, { relations: ['users'] });
  }

  async deleteById(id: number) {
    const findedChat = await this.charRepo.findOne({ id });

    if (!findedChat) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    return await this.charRepo.delete(id);
  }

  async getItems(): Promise<Chat[]> {
    return await this.charRepo.find({ relations: ['users'] });
  }

  async get(id: number): Promise<Chat> {
    const chat = await this.charRepo.findOne(id, { relations: ['users'] });

    if (!chat) {
      throw new BadRequestException(USER_NOT_FOUND);
    }
    return chat;
  }

  // async addUserToChat
}
