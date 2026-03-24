interface SurveyAnswer {
  image?: string;
  answer: string;
}

interface AddSurveyModel {
  question: string;
  answers: SurveyAnswer[];
}

interface AddSurvey {
  add(account: AddSurveyModel): Promise<void>;
}

export { AddSurvey, AddSurveyModel, SurveyAnswer };
