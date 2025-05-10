import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";


export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { 
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"], 
    languageOptions: { globals: {...globals.browser, ...globals.node} },
    rules: {
      "@/no-duplicate-imports": "error",
      "@/no-unused-vars":   ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@/quotes":           ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
      "@/space-in-parens":  ["error", "never"],
      "@/space-infix-ops":  ["error", { int32Hint: false }],
      "@/space-unary-ops":  ["error", { words: true, nonwords: false }],
      "@/keyword-spacing":  ["error", { before: true, after: true }],
      "@/semi-spacing":     ["error", { before: false, after: true }],
    },
  },
  { files: ["**/*.json"],   plugins: { json },      language: "json/json",    extends: ["json/recommended"]     },
  { files: ["**/*.md"],     plugins: { markdown },  language: "markdown/gfm", extends: ["markdown/recommended"] },
  { files: ["**/*.css"],    plugins: { css },       language: "css/css",      extends: ["css/recommended"]      },
  { extends: ["next"], settings: { react: { version: "detect" }, next: { rootDir: "." } } },
  { ignores: [
    "**/node_modules/**", "**/dist/**", "**/build/**", "**/out/**", 
    "**/.next/**", "**/.vercel/**", "**/.turbo/**", "**/.cache/**",
    "**/.idea/**", "**/.git/**", "tsconfig.json", "**/package-lock.json"
  ] },
]);