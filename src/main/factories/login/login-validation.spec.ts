import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../presentation/helpers/validators";
import { EmailValidator, Validation } from "../../../presentation/protocols";
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
