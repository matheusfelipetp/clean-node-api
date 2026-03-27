import { DbAddSurvey } from "./db-add-survey";
import { AddSurveyModel, AddSurveyRepository } from "./db-add-survey-protocols";

interface SutTypes {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
}

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
});

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(surveyData: AddSurveyModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddSurveyRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return { sut, addSurveyRepositoryStub };
};

describe("DbAddSurvey Usecase", () => {
  test("Should call AddSurveyRepository with correct values", async () => {
    const { sut } = makeSut();
    const addSpy = jest.spyOn(sut, "add");
    sut.add(makeFakeSurveyData());
    expect(addSpy).toHaveBeenCalledWith(makeFakeSurveyData());
  });

  test("Should throw if AddSurveyRepository throws", async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest
      .spyOn(addSurveyRepositoryStub, "add")
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.add(makeFakeSurveyData());
    await expect(promise).rejects.toThrow();
  });
});
