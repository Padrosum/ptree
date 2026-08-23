import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**", ".astro/**", "public/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  {
    files: ["*.config.{mjs,ts,mts}", "vitest.config.mts"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["**/*.ts", "**/*.mjs", "**/*.mts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    files: ["**/*.astro"],
    rules: {
      "no-undef": "off",
    },
  }
);