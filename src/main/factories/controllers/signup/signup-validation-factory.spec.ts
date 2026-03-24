import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../../presentation/helpers/validators";
import { EmailValidator, Validation } from "../../../../presentation/protocols";
import { makeSignUpValidation } from "./signup-validation-factory";

jest.mock(
  "../../../../presentation/helpers/validators/validation-composite/validation-composite",
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
