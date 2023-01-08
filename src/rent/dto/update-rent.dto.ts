import { IsDefined, IsEnum } from 'class-validator';
import { RentState } from '../rent.entity';

export class UpdateRentDto {
  @IsDefined()
  @IsEnum(RentState)
  state: RentState;
}
