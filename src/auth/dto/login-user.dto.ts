import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

//* Como esperamos la Data en una peticion de Login

export class LoginUserDto {
  //? Validaciones del class-validator (no entra al controlador mientras no pase las validaciones)
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;
}
