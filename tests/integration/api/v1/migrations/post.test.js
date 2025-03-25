import database from "infra/database";

async function cleanDatabase() {
  await database.query("DROP schema public CASCADE; CREATE schema public");
}

async function checkMigrations() {
  return await database.query("SELECT * FROM pgmigrations");
}

beforeAll(cleanDatabase);

test("POST to api/v1/migrations should return 200", async () => {
  //refactor to assure that the migrations are running
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);
  const response1Body = await response1.json();
  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  const result = await checkMigrations();
  expect(result.rowCount).toBeGreaterThan(0);
  //--------------------------------
  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);
  const response2Body = await response2.json();

  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);
});
