import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { ServiceError } from "infra/errors";

let dbClient;

async function setupDefaultMigrationOptions() {
  dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  return defaultMigrationOptions;
}

async function listPendingMigrations() {
  try {
    const defaultMigrationOptions = await setupDefaultMigrationOptions();
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    await dbClient.end();
    return pendingMigrations;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Error while trying to list pending migrations",
      cause: error,
    });
    throw serviceErrorObject;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  try {
    const defaultMigrationOptions = await setupDefaultMigrationOptions();
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });
    return migratedMigrations;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Error while trying to run pending migrations",
      cause: error,
    });
    throw serviceErrorObject;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
