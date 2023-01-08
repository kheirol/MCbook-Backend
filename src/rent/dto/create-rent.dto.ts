import { IsDefined, IsNumber, IsString } from 'class-validator';

export class CreateRentDto {
  @IsNumber()
  bookId: number;
}

export class TraceNumberQuery {

  @IsString()
  @IsDefined()
  traceNumber: string;
}
