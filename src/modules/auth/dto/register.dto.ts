import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'The name field is required.' })
  @IsString({ message: 'The name must be a string.' })
  name: string;

  @IsEmail({}, { message: 'The email must be a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'The password field is required.' })
  @MinLength(6, { message: 'The password must be at least 6 characters long.' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'The password must contain at least one uppercase letter and one number.',
  })
  password: string;
}
