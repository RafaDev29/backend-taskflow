import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class OperatorUpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['INICIADA', 'CERRADA'])
  state: string;
}
