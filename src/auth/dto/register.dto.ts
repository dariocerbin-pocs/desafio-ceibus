import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { AppRole } from '../../common/roles.enum';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  role?: AppRole;
}
