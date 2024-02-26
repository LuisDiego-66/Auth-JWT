import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { RegisterUserDto, LoginUserDto } from './dto';
import { ValidRoles } from './interfaces/ValidRoles.interface';

import { JwtAuthGuard, RolesGuard } from './guards';
import { GetUser, Rol, Auth } from './decorators';

import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('auth')
export class AuthController {
  constructor(
    //? se injecta la instancia de authService para acceder a sus metodos
    private readonly authService: AuthService,
  ) {}

  //? EndPoint para el Registrar
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  //? EndPoint para el Login
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.authService.findAll(paginationDto);
  }

  //* ---------------- Autenticacion

  @Get('private1')
  //! para usar Guardianes
  @UseGuards(AuthGuard()) //? este es el guard por defecto de passport
  @UseGuards(JwtAuthGuard) //? este es un guard propio, este guard extiende del AuthGuard()
  autenticacion1(@Req() req: Express.Request) {
    return req.user; //? se recupera el usuario de la req
  }

  @Get('private2')
  //! para usar Guardianes
  @UseGuards(JwtAuthGuard)
  autenticacion2(@GetUser() user: User) {
    return user; //? Recuperamos el user del decorador @Getuser
  }

  //* ---------------- Autorizacion

  @Get('private3')
  @Rol(ValidRoles.admin, ValidRoles.superUser) //? este es un Decorador que recibe los roles y los encaja en los metadatos del controlador
  @UseGuards(JwtAuthGuard, RolesGuard) //? RolesGuard recupera la metadata y compara con el usuario de la req (decide si entra o no al controlador)
  autorizacion1(@GetUser() user: User) {
    return user;
  }

  @Get('private4')
  @Auth(ValidRoles.admin, ValidRoles.superUser) //? Un decorador que introduce metadatos, autentifica y autoriza
  autorizacion2(@GetUser() user: User) {
    return user;
  }
}
