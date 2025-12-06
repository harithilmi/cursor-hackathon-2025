import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@kerjaflow/eslint-config/base";
import { nextjsConfig } from "@kerjaflow/eslint-config/nextjs";
import { reactConfig } from "@kerjaflow/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
