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
      // React compiler setState-in-effect rule: downgrade to warning (intentional patterns exist)
      "react-compiler/react-compiler": "warn",
      // Allow explicit any in specific cases where types are complex
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow unused vars to be caught without breaking the build
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    }
  }
]);

export default eslintConfig;
