import { IsDefined, IsOptional, IsString, MinLength, Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';


@ValidatorConstraint({ name: 'customText', async: false })
export class PasswordValidation implements ValidatorConstraintInterface {
  validate(password: string) {
    return  /\d/.test(password) && /[a-zA-Z]/g.test(password)
  }

  defaultMessage() {
    return 'Text ($value) must contain numbers and letters!';
  }
}
export class SignUpDto {
  @IsDefined()
  @IsString()
  email: string;

  @IsDefined()
  @IsString()
  @MinLength(8)
  @Validate(PasswordValidation)
  password: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  address: string;

}
