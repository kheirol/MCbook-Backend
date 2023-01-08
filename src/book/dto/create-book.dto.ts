import { IsDefined, IsNumber, IsString, IsOptional, IsBase64 } from 'class-validator';


export class CreateBookDto {
  @IsString({ always: true })
  @IsDefined()
  name: string;
  
  @IsNumber()
  @IsOptional()
  categoryId: number;
  
  @IsNumber()
  @IsDefined()
  capacity: number;

  @IsString()
  @IsDefined()
  img: string;
}
