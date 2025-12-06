import { defineConfig } from "eslint/config";

import { baseConfig } from "@kerjaflow/eslint-config/base";
import { reactConfig } from "@kerjaflow/eslint-config/react";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
  reactConfig,
);
