import { Router } from "express";
import { adaptRoute } from "../../adapters/express/express-routes-adapter";
import { makeSignInController } from "../../factories/controllers/login/signin/signin-controller-factory";
import { makeSignUpController } from "../../factories/controllers/login/signup/signup-controller-factory";

export default (router: Router): void => {
  router.post("/signup", adaptRoute(makeSignUpController()));
  router.post("/signin", adaptRoute(makeSignInController()));
};
