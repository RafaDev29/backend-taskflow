import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../admins/entities/admin.entity';
import { Task } from './entities/task.entity';
import { Operator } from '../operators/entities/operator.entity';

@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,

    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,

    @InjectRepository(Operator)
    private operatorRepo: Repository<Operator>,
  ) {}

 
  async create(dto: CreateTaskDto, userId: number) {
    const admin = await this.adminRepo.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });

    if (!admin) throw new NotFoundException('Admin no encontrado');

    let assignedOperator: Operator | null = null;

    if (dto.assignedTo) {
      assignedOperator = await this.operatorRepo.findOneBy({ operatorId: dto.assignedTo });
      if (!assignedOperator) throw new NotFoundException('Operador asignado no existe');
    }
    
    const task = this.taskRepo.create({
      name: dto.name,
      description: dto.description,
      state: dto.state,
      createdBy: { adminId: admin.adminId },
      assignedTo: assignedOperator, 
    });
    
    return this.taskRepo.save(task);
    

  
  }

  async findAll(userId: number) {
    const admin = await this.adminRepo.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });
  
    if (!admin) {
      throw new NotFoundException('Admin no encontrado');
    }
  
    return this.taskRepo.find({
      where: { createdBy: { adminId: admin.adminId } },
      relations: ['assignedTo'], // incluye operador si está asignado
    });
  }

  async findMyTasks(userId: number) {
    const operator = await this.operatorRepo.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });
  
    if (!operator) {
      throw new NotFoundException('Operador no encontrado');
    }
  
    return this.taskRepo.find({
      where: { assignedTo: { operatorId: operator.operatorId } },
    });
  }
  
  

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(taskId: number, dto: UpdateTaskDto, userId: number) {
    const admin = await this.adminRepo.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });
  
    if (!admin) throw new NotFoundException('Admin no encontrado');
  
    const task = await this.taskRepo.findOne({
      where: {
        taskId,
        createdBy: { adminId: admin.adminId },
      },
      relations: ['assignedTo', 'createdBy'],
    });
  
    if (!task) {
      throw new NotFoundException('Tarea no encontrada o no pertenece a tu cuenta');
    }
  
    if (dto.name) task.name = dto.name;
    if (dto.description) task.description = dto.description;
    if (dto.state) task.state = dto.state;
  
    if (dto.assignedTo !== undefined) {
      if (dto.assignedTo === null) {
        task.assignedTo = null;
      } else {
        const operator = await this.operatorRepo.findOneBy({ operatorId: dto.assignedTo });
        if (!operator) throw new NotFoundException('Operador asignado no encontrado');
        task.assignedTo = operator;
      }
    }
  
    return await this.taskRepo.save(task);
  }
  

  async remove(taskId: number, userId: number) {
    const admin = await this.adminRepo.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });
  
    if (!admin) throw new NotFoundException('Admin no encontrado');
  
    const task = await this.taskRepo.findOne({
      where: {
        taskId,
        createdBy: { adminId: admin.adminId },
      },
    });
  
    if (!task) {
      throw new NotFoundException('Tarea no encontrada o no pertenece a tu cuenta');
    }
  
    await this.taskRepo.delete(taskId);
  
    return { message: 'Tarea eliminada correctamente' };
  }

  async operatorUpdateState(taskId: number, state: string, userId: number) {
    const operator = await this.operatorRepo.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });
  
    if (!operator) {
      throw new NotFoundException('Operador no encontrado');
    }
  
    const task = await this.taskRepo.findOne({
      where: {
        taskId,
        assignedTo: { operatorId: operator.operatorId },
      },
    });
  
    if (!task) {
      throw new NotFoundException('Tarea no encontrada o no está asignada a ti');
    }
  
    task.state = state;
  
    return this.taskRepo.save(task);
  }
  
  
}
