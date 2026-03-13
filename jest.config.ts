import type { Config } from "jest";

const config: Config = {
  roots: ["<rootDir>/src"],
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageDirectory: "coverage",
  preset: "@shelf/jest-mongodb",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};

export default config;
