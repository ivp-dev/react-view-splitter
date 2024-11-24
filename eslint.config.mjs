import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";

/**
 * @param {string} url
 * @returns {string}
 */
export function getIgnoredFiles(url) {
  const filename = fileURLToPath(url);
  const dirname = path.dirname(filename);
  const gitignorePath = path.resolve(dirname, ".gitignore");

  return includeIgnoreFile(gitignorePath);
}

/** @type {import('eslint').Linter.Config[]} */
export default [
  getIgnoredFiles(import.meta.url),
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { settings: { react: { version: "detect" } } },
  {
    rules: {
      "react/prop-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
