import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import astroPlugin from "eslint-plugin-astro";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.astro"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: {
        // ブラウザグローバル変数
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        FormData: "readonly",
        File: "readonly",
        Blob: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        AbortController: "readonly",
        // Node.js環境用
        console: "readonly",
        // Astro型
        ImageMetadata: "readonly",
        Astro: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off", // TypeScript版を使用
    },
  },
  ...astroPlugin.configs.recommended,
  {
    ignores: [
      "dist/",
      ".astro/",
      "node_modules/",
      "**/*.min.js",
      "**/*.min.css",
      "pnpm-lock.yaml",
      "src/assets/**/*.js", // minifiedファイルを除外
    ],
  },
];
