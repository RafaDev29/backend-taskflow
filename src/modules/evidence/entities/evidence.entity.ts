import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Task } from '../../task/entities/task.entity';

@Entity('evidence')
export class Evidence {
    @PrimaryGeneratedColumn()
    evidenceId: number;

    @Column()
    photo: string;

    @Column()
    latitude: string;

    @Column()
    longitude: string;

    @ManyToOne(() => Task)
    @JoinColumn({ name: 'Idtask' })
    task: Task;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
