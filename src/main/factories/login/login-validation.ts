import { EmailValidation } from "../../../presentation/helpers/validators/email-validation/email-validation";
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field/required-field-validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite/validation-composite";
import { Validation } from "../../../presentation/protocols";
import { EmailValidatorAdapter } from "../../../utils/email-validator/email-validator";

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];

  for (const field of ["email", "password"]) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(new EmailValidation(new EmailValidatorAdapter(), "email"));

  return new ValidationComposite(validations);
};
