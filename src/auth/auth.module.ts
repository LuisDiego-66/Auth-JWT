import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    //* Los Modulos que se importan en el module de Auth (autenticacion)

    //? Se añade para poder usar las variables de entorno dentro del modulo
    ConfigModule, //! para usar el ConfigService.get()

    //? Se añade la entidad User al TypeOrmModule para que se ejecute en la DB
    TypeOrmModule.forFeature([User]),

    //? Se hace la configuracion del Passport, pasandole la estrategia por defecto que usara
    PassportModule.register({
      defaultStrategy: 'jwt', //! para no pasarla cada vez
    }),

    //? Se hace la configuracion del JWT, pasandole las configuraciones del jwt
    JwtModule.registerAsync({
      imports: [ConfigModule], //! se importa(dentro de jwtModule), para usar las variables de entorno
      inject: [ConfigService], //! se injecta en el modulo los servicios del configModule
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'), //! Se usa la variable de entorno para firmar el jwt
          //global:true
          signOptions: {
            expiresIn: '2h', //! cuanto durará un token valido
          },
        };
      },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], //? se agrega la estrategia para que pueda ser usada por el passport
  exports: [],
})
export class AuthModule {}
