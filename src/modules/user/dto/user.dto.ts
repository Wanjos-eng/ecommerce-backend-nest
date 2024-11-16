import {
  IsEmail,
  IsNotEmpty,
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

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString({ message: 'Name must be a string.' })
  name: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either customer or admin.' })
  role?: UserRole;

  @IsOptional()
  @IsString({ message: 'Address must be a string.' })
  address?: string;

  @IsOptional()
  @IsBoolean({ message: 'isTwoFactorEnabled must be a boolean.' })
  isTwoFactorEnabled?: boolean;

  // Propriedades para OAuth
  @IsOptional()
  @IsString({ message: 'Provider must be a string.' })
  provider?: string;

  @IsOptional()
  @IsString({ message: 'Provider ID must be a string.' })
  providerId?: string;
}

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
  role?: UserRole;

  @IsOptional()
  @IsString({ message: 'Address must be a string.' })
  address?: string;

  @IsOptional()
  @IsBoolean({ message: 'isTwoFactorEnabled must be a boolean.' })
  isTwoFactorEnabled?: boolean;

  // Propriedades para OAuth
  @IsOptional()
  @IsString({ message: 'Provider must be a string.' })
  provider?: string;

  @IsOptional()
  @IsString({ message: 'Provider ID must be a string.' })
  providerId?: string;
}
