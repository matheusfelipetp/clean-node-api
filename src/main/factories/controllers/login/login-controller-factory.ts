import { LoginController } from "../../../../presentation/controllers/login/login-controller";
import { Controller } from "../../../../presentation/protocols";
import { makeLogControllerDecorator } from "../../decorators/log/log-controller-decorator-factory";
import { makeDbAuthentication } from "../../useCases/authentication/db-authentication-factory";
import { makeLoginValidation } from "./login-validation-factory";

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation(),
  );

  return makeLogControllerDecorator(loginController);
};
