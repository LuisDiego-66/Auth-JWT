import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

//* Decorador para devolver el user en el controlador (Decorador de Parametro)

//! recibe la data (parametros dentro del parentesis del decorador)
//! recibe el contexto (variable de la que sacaremos el req)
export const GetUser = createParamDecorator(
  (data: string, cxt: ExecutionContext) => {
    const req = cxt.switchToHttp().getRequest(); //? Recuperamos el req
    const user = req.user; //? Recuperamos el el user del req

    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    return user; //? Devolvemos el user
  },
);
