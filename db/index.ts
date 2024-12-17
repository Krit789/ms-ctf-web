import { Kysely, PostgresDialect } from "kysely";
import type { DB } from "~/types/db";
import pg from "pg";
const { Pool } = pg;

const config = useRuntimeConfig();

if (!config.database_url) {
  throw new Error(
    "No Postgres connection string given. Please make sure that it's in your env"
  );
}

export default new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: config.database_url,
      max: 10,
      keepAlive: true,
    }),
  }),
});