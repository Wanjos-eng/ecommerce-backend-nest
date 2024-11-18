import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Role must be provided if specified.' })
  role?: string; // Permite que o campo `role` seja opcional
}
