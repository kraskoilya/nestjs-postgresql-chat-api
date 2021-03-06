import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/shared/models/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('self')
  @HttpCode(200)
  userSelf(@Req() req: any): Promise<User> {
    return this.usersService.userSelf(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  @HttpCode(200)
  getItems(@Req() req: any): Promise<User[]> {
    return this.usersService.getItems(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(200)
  get(@Param('id') id: number): Promise<User> {
    return this.usersService.get(id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  update(@Param('id') id: number, @Body() user: User) {
    return this.usersService.update(id, user);
  }
}
