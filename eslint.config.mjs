import coreWebVitals from "eslint-config-next/core-web-vitals";

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
  // eslint-config-next 16 ships a native flat config.
  ...coreWebVitals,
  {
    // eslint-plugin-react-hooks 7 added these React Compiler rules as errors.
    // They flag existing patterns (setState inside effects, mutation of
    // render-time values, components declared inside components) that work
    // today; fix them as the components are touched, not in one sweep.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/static-components": "warn",
    },
  },
  {
    // Content entries are one anonymous object per file by design.
    files: ["lib/content/**/*.js"],
    rules: { "import/no-anonymous-default-export": "off" },
  },
];

export default eslintConfig;
