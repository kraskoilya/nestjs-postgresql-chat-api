import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from 'src/modules/chats/chats.service';
import { SocketService } from '../modules/external/services/socket.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('SsgGateway');

  constructor(
    private readonly chatService: ChatsService,
    private socketService: SocketService,
  ) {}

  afterInit(server: any) {
    this.socketService.socket = server;
    this.logger.log('Websocket gateway initialized');
  }

  async handleConnection(socket: Socket) {
    this.logger.log('Client connected');
    await this.chatService.getUserFromSocket(socket);
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);
    const message = await this.chatService.savedMessage(content, user);

    this.server.sockets.emit(
      'send_message',

      {
        event: 'send_message',
        data: {
          user,
          message,
        },
      },
    );
  }

  // @SubscribeMessage('request_all_messages')
  // async requestAllMessages(@ConnectedSocket() socket: Socket) {
  //   await this.chatService.getUserFromSocket(socket);
  //   const messages = await this.chatService.getAllMessages();

  //   socket.emit('send_all_messages', messages);
  // }
}
