import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../decorators/roles.decorator';
import { User } from '../../users/entities/user.entity';

//* En este punto la peticion ya paso por authGuart() si que si llego aqui significa que existe un user en la req

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, //! El reflector nos permitira acceder a los metadatos del controlador
  ) {}

  canActivate(context: ExecutionContext): boolean {
    //? Se recuperan los metadatos del controlador

    const roles: string[] = this.reflector.get(
      META_ROLES, //! es la variable definida en el decorador de roles (se la importa)
      context.getHandler(), //! El contexto de ejecucion
    );

    //! si no hay roles en los metadatos entonces la ruta es publica
    if (!roles) return true;
    if (roles.length === 0) return true;

    const req = context.switchToHttp().getRequest(); //? se recupera la request
    const user: User = req.user as User; //? se recupera el user del request

    //! Preguntamos si el usuario que inicio session tiene un rol de los que estan en los metadatos
    for (const rol of user.roles) {
      if (roles.includes(rol)) return true; //? entramos al controlador si tiene un rol
    }
    throw new ForbiddenException('user need a valid role: ' + roles); //? excepcion si no tiene algun rol
  }
}
