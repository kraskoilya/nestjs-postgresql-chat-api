import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('login')
  @HttpCode(200)
  async login(@Body() { login, password }: any) {
    const user = await this.authService.validateUser(login, password);
    return this.authService.login(user);
  }

  @UsePipes(new ValidationPipe())
  @Post('registration')
  @HttpCode(201)
  async registration(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('logout')
  @HttpCode(201)
  async logout(@Headers('Authorization') auth: string) {
    return this.authService.logout(auth);
  }
}
