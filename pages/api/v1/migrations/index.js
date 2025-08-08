import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

let dbClient;

async function getHandler(req, res) {
  const [dbClient, defaultMigrationOptions] = await configMigrationOptions();
  const pendingMigrations = await migrationRunner(defaultMigrationOptions);
  await dbClient.end();
  res.status(200).json(pendingMigrations);
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
}

function onNoMatchHandler(req, res) {
  const methodNotAllowedError = new MethodNotAllowedError();
  res.status(methodNotAllowedError.statusCode).json(methodNotAllowedError);
}

async function onErrorHandler(error, req, res) {
  console.log("Erro dentro do next-connect");
  await dbClient?.end();
  const publicErrorObject = new InternalServerError({ cause: error });
  console.log(publicErrorObject);
  res.status(500).json(publicErrorObject);
}
