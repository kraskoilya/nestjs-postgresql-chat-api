import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { classToPlain, plainToClass } from 'class-transformer';
import { Socket } from 'socket.io';
import { CHAT_NOT_FOUND } from 'src/shared/constants/char.constatnt';
import { User } from 'src/shared/models/user.entity';
import { SocketService } from 'src/shared/modules/external/services/socket.service';
import { getConnection, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { MessageDto } from '../messages/dto/message.dto';
import { Message } from '../messages/message.entety';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../users/users.service';
import { Chat } from './chat.entity';
import { ChatDto } from './dto/chat.dto';
@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private charRepo: Repository<Chat>,
    private readonly messagesService: MessagesService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly socketService: SocketService,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const user = await this.authService.getUserFromAuthenticationToken(
      socket.handshake.headers.authorization.replace('Bearer ', ''),
    );
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  async create(chatDto: ChatDto, user: User): Promise<Chat> {
    const data = classToPlain(chatDto);
    const users = [];

    if (data?.users?.length) {
      for (const { id } of data?.users) {
        const user = await this.userService.get(id);
        users.push(user);
      }
    }

    const createdChat = this.charRepo.create({
      ...plainToClass(Chat, data),
      users,
      created_by: user,
    });
    await this.charRepo.save(createdChat);

    if (createdChat) {
      this.socketService.socket.sockets.emit('chat_created', {
        event: 'chat_created',
        data: {
          user,
          newChat: createdChat,
        },
      });
    }

    return createdChat;
  }

  async update(id: number, chatDto: ChatDto) {
    const findedChat = await this.charRepo.findOne(id, {
      relations: ['users'],
    });

    if (!findedChat) {
      throw new BadRequestException(CHAT_NOT_FOUND);
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
      throw new BadRequestException(CHAT_NOT_FOUND);
    }

    return await this.charRepo.delete(id);
  }

  async getItems(user: User): Promise<Chat[]> {
    const chats = await getConnection()
      .createQueryBuilder(Chat, 'chat')
      .innerJoin('chats_users_users', 'cu', 'chat.id = cu."chatsId"')
      .leftJoinAndSelect('chat.users', 'users')
      .leftJoinAndSelect('chat.last_message', 'last_message')
      .leftJoinAndSelect('chat.created_by', 'created_by')
      .where(`chat."createdById" = ${user.id} OR cu."usersId" = ${user.id}`)
      .getMany();

    return chats;
  }

  async get(id: number): Promise<Chat> {
    const chat = await this.charRepo.findOne(id, { relations: ['users'] });

    if (!chat) {
      throw new BadRequestException(CHAT_NOT_FOUND);
    }
    return chat;
  }

  async createMessage(
    id: number,
    messageDto: MessageDto,
    user: User,
  ): Promise<Message> {
    const chat = await this.charRepo.findOne(id);

    if (!chat) {
      throw new BadRequestException(CHAT_NOT_FOUND);
    } else {
      const userRepo = await this.userService.get(user.id);
      const createdMessage = {
        ...messageDto,
        chat,
        user: userRepo,
      };

      return await this.messagesService.saveMessage(createdMessage);
    }
  }

  async getMessages(
    id: number,
    offset: number,
    limit: number,
  ): Promise<Message[]> {
    const chat = await this.charRepo.findOne(id);

    if (!chat) {
      throw new BadRequestException(CHAT_NOT_FOUND);
    }

    return await this.messagesService.getMessages(id, offset, limit);
  }

  async savedMessage(message: string, user: User) {
    return await this.messagesService.setMessage(message, user);
  }
}
