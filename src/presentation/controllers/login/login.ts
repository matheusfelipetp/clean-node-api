import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return new Promise((resolve) => {
      if (!httpRequest.body.email) {
        resolve(badRequest(new MissingParamError("email")));
      }

      if (!httpRequest.body.password) {
        resolve(badRequest(new MissingParamError("password")));
      }
    });
  }
}
