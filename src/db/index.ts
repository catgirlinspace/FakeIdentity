import { Database } from "bun:sqlite";

const db = new Database(Bun.env.DB_PATH, { create: true });
db.run("PRAGMA journal_mode=WAL;");

export default db;
