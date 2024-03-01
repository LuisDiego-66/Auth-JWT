import { Controller, Post, Body, Get, Req } from '@nestjs/common';

import { Auth, GetUser } from './decorators';

import { AuthService } from './auth.service';
import { RegisterUserDto, LoginUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    //? se injecta la instancia de authService para acceder a sus metodos
    private readonly authService: AuthService,
  ) {}

  //? EndPoint para el Registrar
  /*   @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  } */

  //? EndPoint para el Login
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  //* ---------------- Autenticacion y Autorizacion

  @Get('private1')
  @Auth()
  auth1(@Req() req: Express.Request) {
    return req.user; //? se recupera el usuario de la req
  }

  @Get('private2')
  @Auth()
  //? Decorador personalizado
  auth2(@GetUser() user) {
    return user; //? se recupera el usuario de la req
  }
}
