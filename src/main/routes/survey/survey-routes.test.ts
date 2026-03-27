import { sign } from "jsonwebtoken";
import { Collection } from "mongodb";
import request from "supertest";
import { MongoHelper } from "../../../infra/db/mongodb/helpers/mongo-helper";
import app from "../../config/app";
import env from "../../config/env";

describe("Survey Routes", () => {
  let surveyCollection: Collection;
  let accountCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});

    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("POST /surveys", () => {
    test("Should return 403 on add survey without accessToken", async () => {
      await request(app)
        .post("/api/surveys")
        .send({
          question: "Question",
          answers: [
            {
              answer: "Answer 1",
              image: "http://image-name.com",
            },
            {
              answer: "Answer 2",
            },
          ],
        })
        .expect(403);
    });

    test("Should return 204 on add survey with valid accessToken", async () => {
      const res = await accountCollection.insertOne({
        name: "Matheus",
        email: "matheus@mail.com",
        password: "123456",
        role: "admin",
      });

      const accessToken = sign(
        { id: res.insertedId.toString() },
        env.jwtSecret,
      );

      await accountCollection.updateOne(
        { _id: res.insertedId },
        { $set: { accessToken } },
      );

      await request(app)
        .post("/api/surveys")
        .set("x-access-token", accessToken)
        .send({
          question: "Question",
          answers: [
            {
              answer: "Answer 1",
              image: "http://image-name.com",
            },
            {
              answer: "Answer 2",
            },
          ],
        })
        .expect(204);
    });
  });
});
