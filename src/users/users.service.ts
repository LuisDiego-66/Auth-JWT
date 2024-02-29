import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  logger: any;
  constructor(
    //? se injecta el modelo para ser usado
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //? Create User  ----------------------------------------------------------------------

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);
      const userCreated = await this.userRepository.save(newUser);
      console.log('creado');
      return userCreated;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? FindAll User  ----------------------------------------------------------------------

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
    });
    return users;
  }

  //? FindOne User  ----------------------------------------------------------------------

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  //? Update User  ----------------------------------------------------------------------

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const newUser = await this.userRepository.preload({
        id,
        ...updateUserDto,
      });
      if (!newUser) throw new NotFoundException('User not found');
      const userUpdated = await this.userRepository.save(newUser);
      return userUpdated;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? Delete User  -----------------------------------------------------------------------------

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return 'User deleted';
  }

  //? FindUserLogin User  ----------------------------------------------------------------------

  async findUserForLogin(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    return user;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected Error, check server Logs',
    );
  }
}
