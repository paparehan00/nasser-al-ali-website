import fs from "node:fs";
import { env } from "../config/env.js";

for (const suffix of ["", "-journal", "-wal", "-shm"]) {
  const p = env.dbPath + suffix;
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log("Deleted", p);
  }
}
console.log("DB reset. Run `npm run db:migrate && npm run db:seed`.");
