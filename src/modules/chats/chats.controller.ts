import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { MessageDto } from '../messages/dto/message.dto';
import { Message } from '../messages/message.entety';
import { Chat } from './chat.entity';
import { ChatsService } from './chats.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  @HttpCode(201)
  create(@Req() req: any, @Body() chatDto: ChatDto): Promise<Chat> {
    return this.chatsService.create(chatDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(200)
  get(@Param('id') id: number): Promise<Chat> {
    return this.chatsService.get(id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  update(@Param('id') id: number, @Body() chat: ChatDto) {
    return this.chatsService.update(id, chat);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id') id: number) {
    return this.chatsService.deleteById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  @HttpCode(200)
  getItems(): Promise<Chat[]> {
    return this.chatsService.getItems();
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post(':id/message')
  @HttpCode(201)
  sendMessage(
    @Req() req: any,
    @Param('id') id: number,
    @Body() messageDto: MessageDto,
  ): Promise<Message> {
    return this.chatsService.createMessage(id, messageDto, req.user);
  }
}
