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
}
