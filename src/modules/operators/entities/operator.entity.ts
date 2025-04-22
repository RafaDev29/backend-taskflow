// src/modules/operators/entities/operator.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Admin } from '../../admins/entities/admin.entity'

@Entity('operators')
export class Operator {
  @PrimaryGeneratedColumn()
  operatorId: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  age: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'Iduser' })
  user: User;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'Idadmin' })
  admin: Admin;
}
