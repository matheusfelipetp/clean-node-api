import { SignInController } from "../../../../../presentation/controllers/login/signin/signin-controller";
import { Controller } from "../../../../../presentation/protocols";
import { makeLogControllerDecorator } from "../../../decorators/log/log-controller-decorator-factory";
import { makeDbAuthentication } from "../../../useCases/account/authentication/db-authentication-factory";
import { makeSignInValidation } from "./signin-validation-factory";

export const makeSignInController = (): Controller => {
  const signInController = new SignInController(
    makeDbAuthentication(),
    makeSignInValidation(),
  );

  return makeLogControllerDecorator(signInController);
};
