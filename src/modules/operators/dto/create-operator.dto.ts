// src/modules/operators/dto/create-operator.dto.ts
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateOperatorDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsInt()
  age: number;
}
