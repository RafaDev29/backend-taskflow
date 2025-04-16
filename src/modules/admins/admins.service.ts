import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  
  async create(dto: CreateAdminDto) {
    const exists = await this.userRepo.findOne({ where: { username: dto.username } });
    if (exists) {
      throw new ConflictException('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      username: dto.username,
      password: hashedPassword,
      role: 'ADMIN',
    });
    const savedUser = await this.userRepo.save(user);

    const admin = this.adminRepo.create({
    
      name: dto.name,
      document: dto.document,
      user: savedUser,
    });

    return this.adminRepo.save(admin);
  }

  async findAll() {
    const admins = await this.adminRepo.find({
      relations: ['user'], 
      select: {
        adminId: true,
        name: true,
        document: true,
        user: {
          userId: true,
          username: true,
          role: true,
        },
      },
    });
  
    return admins;
  }
  

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  async update(id: number, dto: UpdateAdminDto) {
    const admin = await this.adminRepo.findOne({
      where: { adminId: id },
      relations: ['user'],
    });
  
    if (!admin) {
      throw new NotFoundException('Administrador no encontrado');
    }
  
    if (dto.name) admin.name = dto.name;
    if (dto.document) admin.document = dto.document;
    if (dto.username) admin.user.username = dto.username;
  
    await this.userRepo.save(admin.user);
    return this.adminRepo.save(admin);
  }

  async remove(id: number) {
    const admin = await this.adminRepo.findOne({
      where: { adminId: id },
      relations: ['user'],
    });
  
    if (!admin) {
      throw new NotFoundException('Administrador no encontrado');
    }
  
    await this.userRepo.delete(admin.user.userId); 
    await this.adminRepo.delete(id); 
  
    return { message: 'Administrador eliminado correctamente' };
  }
}
