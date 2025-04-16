import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}


  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { username: dto.username } });
  
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    const passwordValid = await bcrypt.compare(dto.password, user.password);
  
    if (!passwordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }
  
    const payload = {
      userId: user.userId,
      username: user.username,
      role: user.role,
    };
  
    const token = this.jwtService.sign(payload);
  
   
    const { password, ...userWithoutPassword } = user;
  
    return {
      token,
      user: userWithoutPassword,
    };
  }
  

}
