import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { AppRole } from '../../common/roles.enum';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/(?=.*[!@#$%^&*()_\-+={}[\]:;"'<>,.?/|\\~`])/, {
    message: 'Password must contain at least one special character',
  })
  password!: string;

  @IsOptional()
  role?: AppRole;
}
