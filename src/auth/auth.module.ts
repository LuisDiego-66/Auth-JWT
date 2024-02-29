import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    //* Los Modulos que se importan en el module de Auth (autenticacion)

    //? Se añade para poder usar las variables de entorno dentro del modulo
    ConfigModule,

    //? Se hace la configuracion del Passport, pasandole la estrategia por defecto que usara
    PassportModule.register({
      defaultStrategy: 'jwt', //? La estrategia que usará
    }),

    //? Se hace la configuracion del JWT, pasandole las configuraciones del jwt
    JwtModule.registerAsync({
      /* imports: [ConfigModule], */
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h',
          },
        };
      },
    }),
    UsersModule, //? Modulo de Users
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], //? Se agrega la estrategia para que pueda ser usada por el passport
  exports: [JwtStrategy, PassportModule, JwtModule], //? Se exporta para poder usar donde se importe el modulo
})
export class AuthModule {}
