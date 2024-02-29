import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    //* Los Modulos que se importan en el module principal (APP)

    //?Todas las configuraciones del ConfigModule (variables de entorno)*//
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    //?Configuracion de la Carpeta Publica*//
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // indicamos la carpeta publica
    }),

    //?Todas las configuraciones de la base de datos*//
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, //! cargar automaticamente las entidades
      synchronize: true, //! sincroniza automaticamente las entidades en la DB // en produccion (false)
    }),

    AuthModule,

    CommonModule,

    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
