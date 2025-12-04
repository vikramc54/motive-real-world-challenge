import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config} */
export default [
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2022,
                globalThis: "readonly",
                // Define your custom globals explicitly
                env: "writable", // if you want to modify env
                db: "writable", // if you want to modify db
            },
            parser: parser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            prettier: prettierPlugin,
        },
        rules: {
            ...pluginJs.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            "prettier/prettier": "error", // Highlight Prettier formatting issues
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "@typescript-eslint/no-explicit-any": "warn",
        },
        ignores: ["**/node_modules/**", "**/dist/**"],
    },
    {
        rules: {
            ...prettierConfig.rules, // Prettier compatibility
        },
    },
];
