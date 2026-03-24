import { SignUpController } from "../../../../presentation/controllers/login/signup/signup-controller";
import { Controller } from "../../../../presentation/protocols";
import { makeLogControllerDecorator } from "../../decorators/log/log-controller-decorator-factory";
import { makeDbAddAccount } from "../../useCases/add-account/db-add-account-factory";
import { makeDbAuthentication } from "../../useCases/authentication/db-authentication-factory";
import { makeSignUpValidation } from "./signup-validation-factory";

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication(),
  );

  return makeLogControllerDecorator(signUpController);
};
