import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email is required' })
  email: string;

  @IsString({ message: 'Name must be in alphabets' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must atleast contain 3 letters' })
  @MaxLength(50, { message: 'Name must not exceed 50 letters' })
  name: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword()
  password: string;
}
