
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Admin } from '../../admins/entities/admin.entity';
import { Operator } from '../../operators/entities/operator.entity';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn()
  taskId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  state: string;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'createdBy' })
  createdBy: Admin;

  @ManyToOne(() => Operator, { nullable: true })
  @JoinColumn({ name: 'assignedTo' })
  assignedTo: Operator | null;
  
}
