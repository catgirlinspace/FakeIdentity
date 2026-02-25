import {parseArgs} from 'util'
import {runServer} from '@/server.ts'

const { positionals } = parseArgs({
  args: Bun.argv.slice(2),
  allowPositionals: true,
  strict: false,
});

const command = positionals[0];

switch (command) {
  case "migrate": {
    const { runMigrations } = await import("./db/migrate.ts");
    runMigrations();
    process.exit(0);
  }

  default: {
    runServer()
  }
}
