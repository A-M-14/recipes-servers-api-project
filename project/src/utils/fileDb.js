const fs = require("fs").promises;
const path = require("path");
const DB_PATH = path.join(__dirname, "..", "..", "data", "recipes.json");
async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch (err) {
    // create containing directory if needed and empty array
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, "[]", "utf8");
  }
}
async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, "utf8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error("Failed to parse database file");
  }
}
async function writeDb(data) {
  await ensureDb();
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}
module.exports = { readDb, writeDb };
