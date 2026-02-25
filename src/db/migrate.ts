import db from "./index.ts";
import { migrations } from "../migrations/index.ts";

export function runMigrations() {
    // Ensure the _migrations tracking table exists
    db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

    // Get already-applied migration names
    const applied = new Set(
        db.query("SELECT name FROM _migrations").all()
            .map((row) => (row as { name: string }).name)
    );

    // Find pending migrations
    const pending = migrations.filter((m) => !applied.has(m.name));

    if (pending.length === 0) {
        console.log("✅ No pending migrations.");
        return;
    }

    console.log(`⏳ Running ${pending.length} migration(s)...`);

    for (const migration of pending) {
        const tx = db.transaction(() => {
            migration.up(db);
            db.exec(
                `INSERT INTO _migrations (name) VALUES ('${migration.name}')`
            );
        });

        tx();
        console.log(`  ✔ ${migration.name}`);
    }

    console.log("✅ All migrations applied.");
}

// Allow running standalone: bun src/db/migrate.ts
if (import.meta.main) {
    runMigrations();
}
