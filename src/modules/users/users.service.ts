import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_NOT_FOUND } from 'src/shared/constants/users.constants';
import { User } from 'src/shared/models/user.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>, // private readonly jwtService: JwtService,
  ) {}

  async userSelf(user: User): Promise<User> {
    const findedUser = await this.userRepo.findOne({
      email: user.email,
    });

    if (!findedUser) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }

    delete findedUser.passwordHash;
    return findedUser;
  }

  async getItems(myseft: User): Promise<User[]> {
    return await this.userRepo.find({
      where: { id: Not(myseft.id) },
    });
  }

  async get(id: number): Promise<User> {
    const user = await this.userRepo.findOne(id);

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }
    return user;
  }
}
