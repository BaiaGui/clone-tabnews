import { createRouter } from "next-connect";
import database from "infra/database.js";
import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const router = createRouter();

router.get(getHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

async function getHandler(req, res) {
  const updatedAt = new Date().toISOString();
  //
  const versionQueryResult = await database.query("SHOW server_version;");
  const version = parseFloat(versionQueryResult.rows[0].server_version);
  //
  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;
  //
  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;
  //
  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

function onNoMatchHandler(req, res) {
  const methodNotAllowedError = new MethodNotAllowedError();
  res.status(methodNotAllowedError.statusCode).json(methodNotAllowedError);
}

function onErrorHandler(error, req, res) {
  console.log("Erro no next-connect");
  const publicErrorObject = new InternalServerError({ cause: error });
  console.log(publicErrorObject);
  res.status(500).json(publicErrorObject);
}
