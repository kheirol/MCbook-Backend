import { IsNumber, IsOptional, IsString, MinLength, Validate } from 'class-validator';
import { PasswordValidation } from './SignUp.dto';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(8)
  @Validate(PasswordValidation)
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  balance?: number;

}
