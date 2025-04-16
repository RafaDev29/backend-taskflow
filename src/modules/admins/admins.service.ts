import { ConflictException, Injectable } from '@nestjs/common';
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

  findAll() {
    return `This action returns all admins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
