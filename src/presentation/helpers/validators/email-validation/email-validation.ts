import { InvalidParamError } from "../../../errors";
import { EmailValidator } from "../../../protocols";
import { Validation } from "../validation";

export class EmailValidation implements Validation {
  private readonly emailValidator: EmailValidator;
  private readonly fieldName: string;

  constructor(emailValidator: EmailValidator, fieldName: string) {
    this.emailValidator = emailValidator;
    this.fieldName = fieldName;
  }

  validate(input: any): Error | null {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName]);

    if (!isEmailValid) {
      return new InvalidParamError(this.fieldName);
    }

    return null;
  }
}
