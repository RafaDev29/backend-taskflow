import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Admin } from '../admins/entities/admin.entity';
import { Operator } from '../operators/entities/operator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Admin, Operator])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule { }
