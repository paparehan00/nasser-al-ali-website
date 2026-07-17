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

  smtpHost:     optional("SMTP_HOST", "smtp.gmail.com"),
  smtpPort:     Number(optional("SMTP_PORT", "465")),
  smtpUser:     optional("SMTP_USER", ""),
  smtpPass:     optional("SMTP_PASS", ""),
  mailFromName: optional("MAIL_FROM_NAME", "Nasser Al Ali Enterprises"),
  notifyEmail:  optional("NOTIFY_EMAIL", ""),

  serverRoot,
};
