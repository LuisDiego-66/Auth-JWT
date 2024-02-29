import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { RegisterUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    //? se injecta el servicio de user para usar sus funciones
    private readonly userService: UsersService,
    //? se injecta el servicio de JWT para crear los tokens
    private readonly jwtService: JwtService,
  ) {}

  async register(userRegisterDto: RegisterUserDto) {
    return this.userService.create(userRegisterDto);
  }

  async login(userLoginDto: LoginUserDto) {
    const { email, password } = userLoginDto;
    const user = await this.userService.findUserForLogin(email);

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (email)');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }
    delete user.password;
    const token = this.getJwtToken({ id: user.id });
    return { user: user, token: token };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
