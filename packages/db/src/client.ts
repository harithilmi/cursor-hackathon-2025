import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

declare const process: {
  env: Record<string, string | undefined>;
};

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is required");
}

const client = postgres(process.env.POSTGRES_URL, { max: 1 });

export const db = drizzle(client, {
  schema,
  casing: "snake_case",
});
