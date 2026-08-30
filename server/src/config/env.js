import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, "..", "..");

function required(name) {
  const v = process.env[name];
  if (!v || !v.trim()) {
    throw new Error(`Missing required env var: ${name}. See .env.example`);
  }
  return v.trim();
}

function optional(name, fallback) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : fallback;
}

export const env = {
  nodeEnv: optional("NODE_ENV", "development"),
  isProd: optional("NODE_ENV", "development") === "production",
  port: Number(optional("PORT", "4000")),

  clientOrigins: optional("CLIENT_ORIGIN", "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  dbPath: path.isAbsolute(optional("DB_PATH", "./data/app.db"))
    ? optional("DB_PATH", "./data/app.db")
    : path.resolve(serverRoot, optional("DB_PATH", "./data/app.db")),

  uploadRoot: path.isAbsolute(optional("UPLOAD_ROOT", "./uploads"))
    ? optional("UPLOAD_ROOT", "./uploads")
    : path.resolve(serverRoot, optional("UPLOAD_ROOT", "./uploads")),

  jwtSecret: required("JWT_SECRET"),
  jwtTtlSeconds: Number(optional("JWT_TTL_SECONDS", "43200")),

  adminSeedEmail: optional("ADMIN_EMAIL", ""),
  adminSeedPassword: optional("ADMIN_PASSWORD", ""),
  groqApiKey: optional("GROQ_API_KEY", ""),

  // Build-time var for the client, read here too so the CSP can allow the
  // chat widget's fetch to the worker origin.
  chatApiUrl: optional("VITE_CHAT_API_URL", ""),

  smtpHost:     optional("SMTP_HOST", "smtp.gmail.com"),
  smtpPort:     Number(optional("SMTP_PORT", "465")),
  smtpUser:     optional("SMTP_USER", ""),
  smtpPass:     optional("SMTP_PASS", ""),
  mailFromName: optional("MAIL_FROM_NAME", "Nasser Al Ali Enterprises"),
  // Address shown in "From". Falls back to the SMTP login (required for Gmail;
  // relay providers like Brevo use a separate login, so set this explicitly there).
  mailFromEmail: optional("MAIL_FROM_EMAIL", ""),
  notifyEmail:  optional("NOTIFY_EMAIL", ""),
  // Where a customer's reply should land. Defaults to the monitored company
  // inbox rather than the SMTP account, which is a send-only leads address.
  mailReplyTo:  optional("MAIL_REPLY_TO", "") || optional("NOTIFY_EMAIL", ""),

  // --- Off-platform backup targets (see utils/offsiteBackup.js) ---------
  // A backup that lives on the same volume as the database it copies is not
  // a backup: one lost volume takes the live DB and all 30 rotations with it.
  backup: {
    s3Endpoint:  optional("BACKUP_S3_ENDPOINT", ""),
    s3Bucket:    optional("BACKUP_S3_BUCKET", ""),
    s3Region:    optional("BACKUP_S3_REGION", "auto"),
    s3KeyId:     optional("BACKUP_S3_ACCESS_KEY_ID", ""),
    s3Secret:    optional("BACKUP_S3_SECRET_ACCESS_KEY", ""),
    s3Prefix:    optional("BACKUP_S3_PREFIX", "naa-backups"),
    emailTo:     optional("BACKUP_EMAIL_TO", ""),
  },

  serverRoot,
};
