import { Validation } from "../../../../presentation/protocols";
import { EmailValidator } from "../../../../validation/protocols/email-validator";
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../../validation/validators";
import { makeSignInValidation } from "./signin-validation-factory";

jest.mock(
  "../../../../validation/validators/validation-composite/validation-composite",
);

const makeEmailValidator = (): EmailValidator => {
  class EmailValidtorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidtorStub();
};

describe("SignInValidation Factory", () => {
  test("Should call ValidationComposite with all validations", () => {
    makeSignInValidation();

    const validations: Validation[] = [];

    for (const field of ["email", "password"]) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation(makeEmailValidator(), "email"));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
