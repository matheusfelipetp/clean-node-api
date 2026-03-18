import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { LoginController } from "./login";

interface SutTypes {
  sut: LoginController;
}

const makeSut = (): SutTypes => {
  const sut = new LoginController();
  return { sut };
};

describe("Login Controller", () => {
  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();

    const httRequest = {
      body: {
        password: "any_password",
      },
    };

    const httpResponse = await sut.handle(httRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();

    const httRequest = {
      body: {
        email: "any_email@mail.com",
      },
    };

    const httpResponse = await sut.handle(httRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });
});
