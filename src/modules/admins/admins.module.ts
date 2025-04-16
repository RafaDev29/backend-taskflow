import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { Admin } from './entities/admin.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Admin, User])],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
