import { Module } from '@nestjs/common';
import { ChatsModule } from 'src/modules/chats/chats.module';
import { ChatGateway } from './socket.gateway';

@Module({
  imports: [ChatsModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class SocketModule {}
