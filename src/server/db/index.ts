import { Codegen, KyselyAuth } from "@/lib/next-auth/adapter";
import { DB } from "./types"; // this is the Database interface we defined earlier
import SQLite from "better-sqlite3";
import { CamelCasePlugin, SqliteDialect } from "kysely";

const dialect = new SqliteDialect({
  database: new SQLite("dev.db"),
});

export const db = new KyselyAuth<DB, Codegen>({
  dialect,
  plugins: [new CamelCasePlugin()],
});
