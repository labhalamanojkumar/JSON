import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Generate and persist an admin token when opted-in via GENERATE_ADMIN_TOKEN=1.
 * This is intentionally opt-in so builds and production runs are unchanged unless
 * the environment variable is set. The token is written to `.generated_admin_token`
 * in the project root and also printed to the server logs so you can copy it.
 */
export function ensureAdminToken(): string {
  if (process.env.ADMIN_TOKEN) return process.env.ADMIN_TOKEN;
  // Only generate when explicitly enabled
  if (process.env.GENERATE_ADMIN_TOKEN !== "1") {
    return ""; // caller should treat empty string as "not generated"
  }

  const token = crypto.randomBytes(24).toString("hex");
  const outPath = path.join(process.cwd(), ".generated_admin_token");

  try {
    fs.writeFileSync(outPath, token + "\n", { encoding: "utf8", mode: 0o600 });
    // Log to server stdout so container logs capture it on start
    console.info(`[admin-token] generated token written to ${outPath}`);
    console.info(`[admin-token] token: ${token}`);
  } catch (err) {
    console.warn("[admin-token] failed to write token file:", err);
  }

  // Make available to rest of app during this runtime
  process.env.ADMIN_TOKEN = token;
  return token;
}
