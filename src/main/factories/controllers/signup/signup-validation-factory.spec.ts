import { Validation } from "../../../../presentation/protocols";
import { EmailValidator } from "../../../../validation/protocols/email-validator";
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../../validation/validators";
import { makeSignUpValidation } from "./signup-validation-factory";

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

describe("SignUpValidation Factory", () => {
  test("Should call ValidationComposite with all validations", () => {
    makeSignUpValidation();

    const validations: Validation[] = [];

    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(
      new CompareFieldsValidation("password", "passwordConfirmation"),
    );

    validations.push(new EmailValidation(makeEmailValidator(), "email"));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
