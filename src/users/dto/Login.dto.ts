import { IsDefined, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @MinLength(8)
  @IsDefined()
  password: string;
  
  @IsString()
  @IsDefined()
  email: string;

}
