import { Controller, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { User } from 'src/shared/models/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  @HttpCode(200)
  getItems(): Promise<User[]> {
    return this.usersService.getItems();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(200)
  get(@Param('id') id: number): Promise<User> {
    return this.usersService.get(id);
  }
}
