import love from "eslint-config-love";
import globals from "globals";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "data/**",
      ".vscode/**",
    ],
  },
  {
    ...love,
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ...(love.languageOptions ?? {}),
      globals: {
        ...(love.languageOptions?.globals ?? {}),
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["jest.config.ts"],
        },
      },
    },
    rules: {
      "class-methods-use-this": "off",
      "no-magic-numbers": "off",
    },
  },
];
