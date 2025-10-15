import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js base rules (includes React and TypeScript recommendations)
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Disable formatting-related ESLint rules so Prettier can handle formatting
  ...compat.extends("prettier"),

  // Global ignores
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "public/**"],
  },

  // Basic, safe rules that complement Next defaults
  {
    rules: {
      eqeqeq: ["warn", "smart"],
      curly: ["warn", "multi-line"],
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    },
  },

  // Additional TypeScript-specific rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },
];

export default eslintConfig;
