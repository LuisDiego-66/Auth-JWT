import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //? Para que se vea bonito en consola
  const logger = new Logger('Bootstrap');

  //? Para el prefijo global de Api
  app.setGlobalPrefix('api');

  //? Configuracion de el classValidator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //! para que se filtre la data que se espera
      forbidNonWhitelisted: true, //! para que marque error cuando se mande data no esperada
    }),
  );

  await app.listen(process.env.PORT);
  logger.log(`server run in port: ${process.env.PORT} `);
}
bootstrap();
