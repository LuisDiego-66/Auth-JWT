import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../interfaces/ValidRoles.interface';
import { Rol } from './roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';

//* Decorador Global para:
//* -- introducir metadatos
//* -- realizar la autenticacion e introducir el user al req
//* -- realizar la autenticacion recuperando los metadatos, recuperando el user y comparando los roles

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    Rol(...roles), //? este decorador inserta los metadatos al controlador
    UseGuards(AuthGuard(), RolesGuard), //? estos guards autentifican y autorizan en ese orden
  );
}
