import { db } from "../db/connection.js";

const insert = db.prepare(
  `INSERT INTO audit_log (user_id, action, target, meta, ip)
   VALUES (?, ?, ?, ?, ?)`
);

export function audit({ userId = null, action, target = null, meta = null, ip = null }) {
  insert.run(
    userId,
    String(action).slice(0, 64),
    target ? String(target).slice(0, 128) : null,
    meta ? JSON.stringify(meta).slice(0, 2000) : null,
    ip ? String(ip).slice(0, 64) : null
  );
}
