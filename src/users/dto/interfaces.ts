import { IsDefined, IsNumber } from "class-validator";

export class ChargeDTO {

  @IsNumber()
  @IsDefined()
  value: number;
}