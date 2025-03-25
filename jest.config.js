const nextJest = require("next/jest");
const dotenv = require("dotenv");
const path = require("path");

const envPath = path.resolve(__dirname, ".env.development");
dotenv.config({ path: envPath });

const createJestConfig = nextJest({});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
});

module.exports = jestConfig;
