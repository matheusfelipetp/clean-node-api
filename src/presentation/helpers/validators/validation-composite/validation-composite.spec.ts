import { MissingParamError } from "../../../errors";
import { Validation } from "../validation";
import { ValidationComposite } from "./validation-composite";

interface 

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return new MissingParamError("field");
    }
  }
  return new ValidationStub();
};

const makeSut = (): ValidationComposite => {
  const validationStub = makeValidationStub();
  const sut = new ValidationComposite([validationStub]);
  return sut;
};

describe("ValidationComposite", () => {
  test("Should return an error if any validation fails", () => {
    const sut = makeSut();
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });
});
