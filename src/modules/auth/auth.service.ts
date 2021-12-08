import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { classToPlain, plainToClass } from 'class-transformer';
import {
  ALREADY_REGISTER_USER,
  USER_NOT_FOUND,
  USER_WRONG_CREDENTIALS,
} from 'src/shared/constants/users.constants';
import { User } from 'src/shared/models/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto) {
    const hasUser = await this.userRepo.findOne({
      email: user.email,
    });

    if (hasUser) {
      throw new BadRequestException(ALREADY_REGISTER_USER);
    }

    const salt = await genSalt(10);
    const newUSer = {
      ...user,
      email: user.email,
      passwordHash: await hash(user.password, salt),
    };
    const data = classToPlain(newUSer);

    const createdUser = this.userRepo.create(plainToClass(User, data));
    await this.userRepo.save(createdUser);

    return createdUser;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };

    delete user.passwordHash;
    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userRepo.findOne({
      email,
    });

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }

    const password = await compare(pass, user.passwordHash);

    if (!password) {
      throw new UnauthorizedException(USER_WRONG_CREDENTIALS);
    }

    return user;
  }
}
