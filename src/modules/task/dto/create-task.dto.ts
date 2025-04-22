import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsOptional()
  @IsInt()
  assignedTo?: number;
}
