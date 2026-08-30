import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { env } from "../config/env.js";
import { sendSystemMail } from "./mailer.js";

// Ships a finished backup somewhere that is not the Railway volume.
//
// db:backup writes into `dirname(DB_PATH)/backups`, which in production is the
// same mounted volume as app.db itself. That protects against an admin
// deleting the wrong thing, but not against losing the volume - which takes
// the live database and all 30 rotations with it, and is the only failure in
// this stack with no recovery path. Everything here exists to put one copy
// beyond that blast radius.
//
// Two independent targets, either or both:
//   S3-compatible object storage (Cloudflare R2, AWS S3, Backblaze B2)
//   email attachment (the DB is ~120 KB, far inside any attachment limit)

const sha256hex = (b) => crypto.createHash("sha256").update(b).digest("hex");
const hmac = (key, str) => crypto.createHmac("sha256", key).update(str, "utf8").digest();

// Minimal SigV4-signed PUT. Hand-rolled rather than pulling in the ~10 MB
// @aws-sdk/client-s3 for one request against a fixed, query-free URL.
export async function putObject({ endpoint, bucket, key, region, accessKeyId, secretAccessKey, body, contentType = "application/octet-stream" }) {
  const url = new URL(`${endpoint.replace(/\/+$/, "")}/${bucket}/${key.split("/").map(encodeURIComponent).join("/")}`);

  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, ""); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256hex(body);

  const headers = {
    host: url.host,
    "content-type": contentType,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  const names = Object.keys(headers).sort();
  const signedHeaders = names.join(";");
  const canonicalHeaders = names.map((h) => `${h}:${headers[h]}\n`).join("");

  const canonicalRequest = ["PUT", url.pathname, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const scope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256hex(canonicalRequest)].join("\n");

  let signingKey = hmac(`AWS4${secretAccessKey}`, dateStamp);
  for (const part of [region, "s3", "aws4_request"]) signingKey = hmac(signingKey, part);
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign, "utf8").digest("hex");

  headers.authorization =
    `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(url, { method: "PUT", headers, body });
  if (!res.ok) {
    throw new Error(`S3 PUT ${res.status} ${res.statusText}: ${(await res.text()).slice(0, 300)}`);
  }
  return `${url.origin}${url.pathname}`;
}

const s3Configured = () => {
  const b = env.backup;
  return Boolean(b.s3Endpoint && b.s3Bucket && b.s3KeyId && b.s3Secret);
};

// Returns { ok, targets: [...], errors: [...] } and never throws: a failed
// off-site copy must not make `npm run db:backup` exit non-zero and mask the
// fact that the local backup itself succeeded.
export async function shipOffsite(filePath) {
  const name = path.basename(filePath);
  const targets = [];
  const errors = [];

  if (!s3Configured() && !env.backup.emailTo) {
    return { ok: false, targets, errors: ["no off-site target configured"] };
  }

  const body = fs.readFileSync(filePath);

  if (s3Configured()) {
    const b = env.backup;
    try {
      const at = await putObject({
        endpoint: b.s3Endpoint,
        bucket: b.s3Bucket,
        key: `${b.s3Prefix.replace(/^\/+|\/+$/g, "")}/${name}`,
        region: b.s3Region,
        accessKeyId: b.s3KeyId,
        secretAccessKey: b.s3Secret,
        body,
      });
      targets.push(at);
    } catch (err) {
      errors.push(`S3: ${err.message}`);
    }
  }

  if (env.backup.emailTo) {
    try {
      await sendSystemMail({
        to: env.backup.emailTo,
        subject: `NAA database backup ${name}`,
        text: [
          `Automatic off-site backup of the Nasser Al Ali Enterprises website database.`,
          ``,
          `File:  ${name}`,
          `Size:  ${(body.length / 1024).toFixed(1)} KB`,
          `Taken: ${new Date().toISOString().replace("T", " ").slice(0, 19)} UTC`,
          ``,
          `Keep this message. To restore, save the attachment and upload it to`,
          `the hosting volume as app.db, replacing the existing file.`,
        ].join("\n"),
        attachments: [{ filename: name, content: body }],
      });
      targets.push(`email:${env.backup.emailTo}`);
    } catch (err) {
      errors.push(`email: ${err.message}`);
    }
  }

  return { ok: targets.length > 0, targets, errors };
}
