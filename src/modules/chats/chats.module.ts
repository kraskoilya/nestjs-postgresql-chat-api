import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesModule } from '../messages/messages.module';
import { UsersModule } from '../users/users.module';
import { Chat } from './chat.entity';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    ConfigModule,
    UsersModule,
    MessagesModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
