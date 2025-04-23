import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEvidenceDto {
  @IsString()
  @IsNotEmpty()
  latitude: string;

  @IsString()
  @IsNotEmpty()
  longitude: string;

  @IsNotEmpty()
  taskId: number;
}
