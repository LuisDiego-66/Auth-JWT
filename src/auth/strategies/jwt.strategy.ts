import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtractJwt, Strategy } from 'passport-jwt'; //! se importa strategy desde aqui porq sera con JWT
import { Repository } from 'typeorm';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../entities/user.entity';

//* esta estrategia usara JWT (se le pasa toda la configuracion al super)

@Injectable() //! porque injectaremos esta clase en el AuthModule
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    //? Para el uso del userRepository

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    //? para el uso de las variables de entorno (JWT_SECRET)
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'), //! se le pasa la llave secreta
      //ignoreExpiration: false,                                //! si ignorara el vencimiento o no
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //! se indica de donde obtendra el jwt
    });
  }

  //* El metodo validate es obligatorio
  //? Passport primero verifica la firma del JWT y decodifica el JSON.
  //? luego invoca nuestro validate() y le pasa el JSON decodificado como único parámetro.
  //? entonces tenemos la garantía de que recibiremos un token válido
  //? que previamente firmamos y emitimos a un usuario válido.
  //! si el token no es valido o ha expirado entpnces no entrará al metodo validate
  validate(payload: JwtPayload) {
    //console.log('hola desde la estrategia (metodo validate)');
    const { id } = payload;

    const user = this.userRepository.findOneBy({ id }); //? se busca el user que tenga el id que estaba en esl payload

    if (!user) throw new UnauthorizedException('Token no valid');

    return user; //! El user es insertado en la Request
  }
}
