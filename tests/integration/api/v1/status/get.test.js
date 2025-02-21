test("GET to api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  //updated_at
  expect(responseBody.updated_at).toBeDefined();
  const parsedUpdateAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdateAt);
  // //version
  // expect(responseBody.dependencies.database.version).toBeDefined();
  // expect(typeof responseBody.dependencies.database.version).toBe("number");
  // console.log(responseBody);
  // //max_connections
  // expect(responseBody.dependencies.database.max_connections).toBeDefined();
  // expect(typeof responseBody.dependencies.database.max_connections).toBe(
  //   "number",
  // );
  // //used_connections
  // expect(responseBody.dependencies.database.used_connections).toBeDefined();
  // expect(typeof responseBody.dependencies.database.used_connections).toBe(
  //   "number",
  // );
  expect(responseBody.dependencies.database.version).toBeDefined();
  expect(responseBody.dependencies.database.max_connections).toBeDefined();
  expect(responseBody.dependencies.database.opened_connections).toBeDefined();
  console.log(responseBody);
});
