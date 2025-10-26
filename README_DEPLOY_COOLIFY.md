How to deploy JSONFormatterPro to Coolify (VPS)

This guide explains the minimal steps to containerize and deploy this Next.js app to Coolify.

Prerequisites
- A Coolify instance (self-hosted) or workspace with a target host (VPS).
- Docker available on the host (Coolify handles this for you).

Key files included
- `Dockerfile` — multi-stage build (build and runtime stages).
- `.dockerignore` — excludes local files from build context.
- `package.json` — `start` script respects `$PORT`.

Deployment steps (in Coolify UI)
1. Create a new app and choose "Dockerfile" as the build method.
2. Point Coolify to this repository (or upload the project files).
3. Configure environment variables in Coolify's service settings (do NOT include secrets in the repo):
   - `MONGODB_URI` — your production MongoDB connection string
   - `MONGODB_DB` — database name (optional)
   - `ADMIN_TOKEN` — secure token used for admin cookie
   - `SUPERADMIN_USER` / `SUPERADMIN_PASS` — for initial login fallback (recommended to use DB users instead)
   - `NODE_ENV=production`
4. Set the build command to: `npm ci --legacy-peer-deps && npm run build`
   (Coolify may run `docker build` which executes the Dockerfile stages automatically.)
5. Set the start command (if required) to: `npm start` — the Dockerfile already uses this.
6. Expose port `3000` in the service settings (Coolify typically maps it automatically).

Security notes
- Never commit `.env.local` or secrets to the repo. Use Coolify's environment variable UI to store secrets.
- For production, prefer DB-backed admin users instead of environment fallback credentials.

Troubleshooting
- If the app fails during `npm run build`, check `dev-server.log` or the build logs in Coolify for missing environment variables or incompatible Node versions. The Dockerfile uses Node 20.
- If you see connection refused after deployment, verify the service port, Coolify proxy rules, and that your VPS firewall allows inbound connections on the app port.

That's it — with the provided Dockerfile and guidance, Coolify can build and run this app as a containerized service.
