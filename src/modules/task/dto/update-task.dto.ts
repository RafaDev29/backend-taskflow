import { IsOptional, IsString, IsIn, IsInt } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['PENDIENTE', 'INICIADA', 'CERRADA'])
  state?: string;

  @IsOptional()
  @IsInt()
  assignedTo?: number;
}
