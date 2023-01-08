import { CreateBookDto } from './create-book.dto';
import { IsDefined, IsPositive } from 'class-validator';

export class UpdateBookDto extends CreateBookDto {
  @IsDefined()
  @IsPositive()
  id: number;

  
}
