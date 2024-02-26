import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

//! cuando se coloca el canActivate ya no funcionan los metodos de la estrategia
//? se puede usar para colocar una cadena de estrategias
@Injectable()
export class JwtAuthGuard extends AuthGuard() {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //console.log('JwtGuard');
    //! si no se coloca, la funcion sobreescribira AuthGuard() y no se usara la estrategia de ese guard
    return super.canActivate(context); //! para que utilice el canActivate de AuthGuard()
  }
}
