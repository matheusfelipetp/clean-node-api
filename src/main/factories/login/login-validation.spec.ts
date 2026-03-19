import { EmailValidation } from "../../../presentation/helpers/validators/email-validation/email-validation";
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field/required-field-validation";
import { Validation } from "../../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite/validation-composite";
import { EmailValidator } from "../../../presentation/protocols";
import { makeLoginValidation } from "./login-validation";

jest.mock(
  "../../../presentation/helpers/validators/validation-composite/validation-composite",
);

const makeEmailValidator = (): EmailValidator => {
  class EmailValidtorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidtorStub();
};

describe("LoginValidation Factory", () => {
  test("Should call ValidationComposite with all validations", () => {
    makeLoginValidation();

    const validations: Validation[] = [];

    for (const field of ["email", "password"]) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation(makeEmailValidator(), "email"));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
