import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import tseslint from "typescript-eslint"; // For TypeScript specific rules
import nextPlugin from "@next/eslint-plugin-next"; // For Next.js specific rules

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  // Base configurations from Next.js (includes React, core web vitals)
  ...compat.extends("next/core-web-vitals"), 

  // Language options for all files (can be overridden)
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // TypeScript specific configurations
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true, // Assumes tsconfig.json is at the root
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // From your .eslintrc.json
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-explicit-any": "warn", // Added as a sensible default, was in old attempts
      
      // Other recommended TypeScript rules (optional, adjust as needed)
      // ... tseslint.configs.recommended.rules,
      // ... tseslint.configs.strict.rules, (can be too strict)
    },
  },

  // Next.js specific configurations
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      // From your .eslintrc.json & Next.js plugin best practices
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@next/next/no-img-element": "warn", 
    },
  },
  
  // General React / JSX rules (some might be covered by Next.js extends)
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    rules: {
      // From your .eslintrc.json
      "react/no-unescaped-entities": "off",
      "react/react-in-jsx-scope": "off", // Not needed with Next.js 17+ and new JSX transform
    },
  },
  
  // Global ignores (already in your .eslintrc.json, good to have here too)
  {
    ignores: ["node_modules/", ".next/", "dist/", "out/"],
  }
];

export default eslintConfig;
