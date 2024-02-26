import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/ValidRoles.interface';

export const META_ROLES = 'roles'; //! el nombre de la metadata del setMetaData

export const Rol = (...args: ValidRoles[]) => {
  return SetMetadata(META_ROLES, args); //! la metadata que se agregará al controlador, o a la ruta
};
