import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'The email must be a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'The password field is required.' })
  @MinLength(6, { message: 'The password must be at least 6 characters long.' })
  password: string;
}
