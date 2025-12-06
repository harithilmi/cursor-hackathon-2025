import { defineConfig } from "eslint/config";

import { baseConfig } from "@kerjaflow/eslint-config/base";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
);
