import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { AdminsModule } from './modules/admins/admins.module';
import { OperatorsModule } from './modules/operators/operators.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRootAsync(typeOrmAsyncConfig), UsersModule, AuthModule, AdminsModule, OperatorsModule, TaskModule],
  
})
export class AppModule {}
