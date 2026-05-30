import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Suppress scratch scripts from strict type checking
    "scratch/**",
  ]),
  {
    rules: {
      // Allow explicit any in specific cases where types are complex
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow unused vars to be caught without breaking the build
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      // Disable overly strict setState-in-effect rule (pattern is intentional in this codebase)
      "react-hooks/set-state-in-effect": "off",
    }
  }
]);

export default eslintConfig;
