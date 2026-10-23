import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Flat config only matches .js/.mjs/.cjs by default; include JSX files.
  { files: ["**/*.{js,jsx,mjs}"] },
  {
    // Build output, deps, static assets, Claude worktrees and local scratch
    // folders are not source; linting them fails on generated code.
    ignores: [
      ".next/**",
      ".vercel/**",
      "node_modules/**",
      "public/**",
      ".claude/**",
      "output/**",
      "tmp/**",
      "design/**",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    // Content entries are one anonymous object per file by design.
    files: ["lib/content/**/*.js"],
    rules: { "import/no-anonymous-default-export": "off" },
  },
];

export default eslintConfig;
