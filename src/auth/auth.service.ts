import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class AuthService {
  constructor(
    //? se injecta el repositorio de User para usar sus metodos
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    //? se injecta el servicio de JWT para crear los tokens
    private readonly jwtService: JwtService,
  ) {}

  async register(userRegisterDto: RegisterUserDto) {
    try {
      //! Creamos la instancia del user
      const userCreated = this.userRepository.create(userRegisterDto);
      await this.userRepository.save(userCreated); //* hacemos el commit en la DB

      //TODO: Generamos el Token JWT
      const token = this.getJwtToken({ id: userCreated.id });
      return {
        user: userCreated,
        token: token,
      };
      //TODO:
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(userLoginDto: LoginUserDto) {
    const { email, password } = userLoginDto;

    //! Recuperamos el user con el email
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    //! Si el user no existe
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (email)');
    }

    //! Si el password no coincide
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('credenciales (password)' + password);
    }

    //! Elimina informacion del objeto
    delete user.password;

    //TODO: Generamos el Token JWT
    const token = this.getJwtToken({ id: user.id });
    return {
      user: user,
      token: token,
    };
    //TODO:
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
    });
    return users;
  }

  //? Genera JWT con la data que reciva
  private getJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload); //! se crea la firma del token con la data (payload)
    return token;
  }

  private handleDBErrors(error: any): never {
    //! el error marca que ya existe el email en la DB (23505)
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('lo sientoooo :C');
  }
}
