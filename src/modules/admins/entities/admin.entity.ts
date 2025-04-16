import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn()
  adminId: number;

  @Column()
  name: string;

  @Column()
  document: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'Iduser' })
  user: User;
}
