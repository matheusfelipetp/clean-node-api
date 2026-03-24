import { InvalidParamError } from "../../../presentation/errors";
import { Validation } from "../../../presentation/protocols";
import { EmailValidator } from "../../protocols/email-validator";

export class EmailValidation implements Validation {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly fieldName: string,
  ) {}

  validate(input: any): Error | null {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName]);

    if (!isEmailValid) {
      return new InvalidParamError(this.fieldName);
    }

    return null;
  }
}
