import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

//* La entidad de Usuario

@Entity('Users') //! Como se llamará en la base de datos
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string; //? id Unico

  @Column('text', { unique: true })
  email: string; //? email Unico

  @Column('text', {
    select: false, //! para que no lo muestre al hacer un select(solo funciona en los find)
  })
  password: string;

  @Column('text')
  fullName: string;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[]; //? un arreglo de roles que por defecto es creado con User

  @BeforeInsert()
  hashingPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
