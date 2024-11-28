import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

// DTO para atualizar usuário
export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either customer or admin.' })
  role?: UserRole; // Usado apenas em cenários administrativos

  @IsOptional()
  @IsString({ message: 'Address must be a string.' })
  address?: string;

  @IsOptional()
  @IsBoolean({ message: 'isTwoFactorEnabled must be a boolean.' })
  isTwoFactorEnabled?: boolean;
}

// DTO para deletar usuário (caso necessário no futuro)
export class DeleteUserDto {
  @IsOptional()
  @IsString({ message: 'Reason must be a string.' })
  reason?: string;
}
