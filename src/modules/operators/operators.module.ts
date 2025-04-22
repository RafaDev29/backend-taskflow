import { Module } from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { OperatorsController } from './operators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../admins/entities/admin.entity';
import { User } from '../users/entities/user.entity';
import { Operator } from './entities/operator.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Admin, User, Operator])],
  controllers: [OperatorsController],
  providers: [OperatorsService],
})
export class OperatorsModule {}
