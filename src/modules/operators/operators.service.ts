import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Admin } from '../admins/entities/admin.entity';
import { Operator } from './entities/operator.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
@Injectable()
export class OperatorsService {

  constructor(
    @InjectRepository(Operator) private operatorRepo: Repository<Operator>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
  ) {}


  async create(dto: CreateOperatorDto, userId: number) {
    // Buscar al admin que está autenticado por su userId
    const admin = await this.adminRepo
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.user', 'user')
      .where('user.userId = :userId', { userId })
      .getOne();

    if (!admin) {
      throw new NotFoundException('No tienes permiso para crear operadores');
    }

    // Validar que no exista otro usuario con el mismo username
    const existingUser = await this.userRepo.findOne({
      where: { username: dto.username },
    });

    if (existingUser) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    // Crear usuario vinculado al operador
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      username: dto.username,
      password: hashedPassword,
      role: 'OPERATOR',
    });
    const savedUser = await this.userRepo.save(user);

    // Crear operador y vincular userId + adminId
    const operator = this.operatorRepo.create({
      name: dto.name,
      lastname: dto.lastname,
      age: dto.age,
      user: { userId: savedUser.userId },
      admin: { adminId: admin.adminId }, 
    });

    return await this.operatorRepo.save(operator);
  }




  async findAll(userId: number) {
    const admin = await this.adminRepo.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });
  
    if (!admin) throw new NotFoundException('Admin no encontrado');
  
    return this.operatorRepo.find({
      where: { admin: { adminId: admin.adminId } },
      relations: ['user'],
    });
  }
  

  findOne(id: number) {
    return `This action returns a #${id} operator`;
  }

  async update(operatorId: number, dto: Partial<CreateOperatorDto>, userId: number) {
    const admin = await this.adminRepo.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });
  
    if (!admin) {
      throw new NotFoundException('Admin no encontrado');
    }
  
    const operator = await this.operatorRepo.findOne({
      where: {
        operatorId,
        admin: { adminId: admin.adminId },
      },
      relations: ['user'],
    });
  
    if (!operator) {
      throw new NotFoundException('Operador no encontrado o no pertenece a tu cuenta');
    }

    if (dto.name) operator.name = dto.name;
    if (dto.lastname) operator.lastname = dto.lastname;
    if (dto.age) operator.age = dto.age;
    if (dto.username) {
      operator.user.username = dto.username;
    }
  
    if (dto.password) {
      operator.user.password = await bcrypt.hash(dto.password, 10);
    }
  
    await this.userRepo.save(operator.user);
    return await this.operatorRepo.save(operator);
  }
  
  

  async remove(operatorId: number, userId: number) {
    const admin = await this.adminRepo.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });
  
    if (!admin) {
      throw new NotFoundException('Admin no encontrado');
    }
  
    const operator = await this.operatorRepo.findOne({
      where: {
        operatorId,
        admin: { adminId: admin.adminId },
      },
      relations: ['user'],
    });
  
    if (!operator) {
      throw new NotFoundException('Operador no encontrado o no pertenece a tu cuenta');
    }
  
   
    await this.operatorRepo.delete(operatorId);
    await this.userRepo.delete(operator.user.userId);
  
    return { message: 'Operador eliminado correctamente' };
  }
  
  
}
