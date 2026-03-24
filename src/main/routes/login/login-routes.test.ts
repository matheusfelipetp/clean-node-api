import { hash } from "bcrypt";
import { Collection } from "mongodb";
import request from "supertest";
import { MongoHelper } from "../../../infra/db/mongodb/helpers/mongo-helper";
import app from "../../config/app";
import env from "../../config/env";

describe("Login Routes", () => {
  let accountCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("POST /signup", () => {
    test("Should return 200 on signup", async () => {
      await request(app)
        .post("/api/signup")
        .send({
          name: "any_name",
          email: "any_email@mail.com",
          password: "any_password",
          passwordConfirmation: "any_password",
        })
        .expect(200);
    });
  });

  describe("POST /signin", () => {
    test("Should return 200 on signin", async () => {
      const password = await hash("any_password", 12);

      await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password: password,
      });

      await request(app)
        .post("/api/signin")
        .send({
          email: "any_email@mail.com",
          password: "any_password",
        })
        .expect(200);
    });

    test("Should return 401 on signin", async () => {
      await request(app)
        .post("/api/signin")
        .send({
          email: "any_email@mail.com",
          password: "any_password",
        })
        .expect(401);
    });
  });
});
