import { Express, Router } from "express";
import path from "path";
import fg from "fast-glob";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);

  fg.sync("src/main/routes/**/**routes.ts").map((file) => {
    const route = require(path.resolve(file));
    route.default(router);
  });
};
