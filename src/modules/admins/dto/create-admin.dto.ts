import { IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  name: string;

  @IsString()
  document: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}
