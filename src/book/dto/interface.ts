import { IsEnum, IsNumberString, IsString } from "class-validator";

export enum SortEnum {
  RentsHigh = 'rent_desc',
  RentsLow = 'rent_asc',
}

export enum DateEnum {
  DateDesc = 'date_desc',
}

export class SortQuery {
  @IsString()
  @IsEnum(SortEnum)
  sort?: SortEnum
}

export class CategoryQuery {
  @IsNumberString()
  category?: string;
}
export class NameQuery {
  @IsString()
  name?: string;
}

export class DateQuery {
  @IsEnum(DateEnum)
  date?: DateEnum
}