import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["src/public/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**", "src/app/**", "../app/**", "../../app/**"],
              message:
                "Public code cannot import from the private app bucket; use shared components instead.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/routes/MarketingRoutes.tsx", "src/shells/MarketingShell.tsx", "src/components/landing/**/*.{ts,tsx}", "src/pages/marketing/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/contexts/AppProvider", "@/contexts/AppProvider/**"],
              message: "Marketing shell cannot import AppProvider - use MarketingShell instead.",
            },
            {
              group: ["@/contexts/NotificationContext", "@/contexts/NotificationContext/**"],
              message: "Marketing shell cannot import NotificationContext - use sonner toast directly.",
            },
            {
              group: ["@/lib/queryConfig"],
              message: "Marketing shell cannot import queryConfig - marketing pages should not use React Query.",
            },
            {
              group: ["@/contexts/WorkspaceContext", "@/contexts/WorkspaceContext/**"],
              message: "Marketing shell cannot import WorkspaceContext - only dashboard pages need workspace context.",
            },
          ],
        },
      ],
    },
  },
);
