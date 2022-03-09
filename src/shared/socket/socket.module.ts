import { Module } from '@nestjs/common';
import { ChatsModule } from 'src/modules/chats/chats.module';
import { ExternalModule } from '../modules/external/external.module';
import { ChatGateway } from './socket.gateway';

@Module({
  imports: [ChatsModule, ExternalModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class SocketModule {}
