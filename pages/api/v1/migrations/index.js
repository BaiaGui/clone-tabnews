import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

let dbClient;

async function getHandler(req, res) {
  try {
    const [dbClient, defaultMigrationOptions] = await configMigrationOptions();
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    await dbClient.end();
    res.status(200).json(pendingMigrations);
  } finally {
    await dbClient?.end();
  }
}
async function configMigrationOptions() {
  dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  return [dbClient, defaultMigrationOptions];
}

async function postHandler(req, res) {
  try {
    const [dbClient, defaultMigrationOptions] = await configMigrationOptions();
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      res.status(201).json(migratedMigrations);
    }
    res.status(200).json(migratedMigrations);
    await dbClient.end();
  } finally {
    await dbClient?.end();
  }
}
