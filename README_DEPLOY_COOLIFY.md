# Deploying JSON Formatter to Coolify (VPS)

This repo is prepared to run on Coolify (self-hosted PaaS) using Docker. The repository includes a multi-stage `Dockerfile` that builds the Next.js app and runs it in production.

Steps to deploy:

1. In Coolify, create a new app and connect your repository (GitHub/GitLab or direct Git URL).
2. Use the Docker deployment method and point it at the project root where the `Dockerfile` lives.
3. Configure environment variables (see below).
4. Build (Coolify will run `npm ci` in the builder stage and `npm run build`). The runtime command uses `npm start` which binds to `$PORT`.

Important environment variables
- `PORT` (optional) — port used by the container (default 3000).
- `MYSQL_URL` or `DATABASE_URL` — MySQL connection string used at runtime.
- `ADMIN_TOKEN` / `GENERATE_ADMIN_TOKEN` — admin auth token variables as used by the app.
- `DEBUG_MONGO` — set to `1` to enable legacy MongoDB helper logs if you need debugging.
- Any other envs in `.env.example` should be set in Coolify's environment settings.

Example `MYSQL_URL`
```
mysql://<user>:<password>@<host>:<port>/<database>?ssl-mode=REQUIRED
```
Set this value securely in Coolify's environment/secret settings (do not commit credentials to the repo).

Secrets and local `.env` files
--------------------------------
This repo intentionally ignores local environment files (see `.gitignore` / `.dockerignore`).
Do not commit `.env.local` or other secret files to the repository. In Coolify, add secrets in the environment settings for the service instead.

Notes and recommendations
- The Dockerfile uses a non-root user for runtime safety.
- The image exposes healthcheck that queries `/api/health`. If your app does not implement `/api/health`, either add a lightweight route or remove the HEALTHCHECK line in the Dockerfile.
- Coolify lets you map ports and set secrets — add database credentials there.
- If you prefer automatic static export (no Node server), you can adapt the Dockerfile to run `next export` and serve the `out` directory with a static server; however, server features and API routes require the Node server.

Troubleshooting
- If builds fail due to peer-dependency issues, ensure your package-lock.json is up to date locally and push it, or let Coolify use `npm install` by removing package-lock from the build context.
- For runtime errors involving DB connections, check the environment variables and MySQL connectivity (Coolify allows defining network/private IPs if hosting DB separately).
How to deploy JSONFormatterPro to Coolify (VPS)

This guide explains the minimal steps to containerize and deploy this Next.js app to Coolify.

Prerequisites
- A Coolify instance (self-hosted) or workspace with a target host (VPS).
- Docker available on the host (Coolify handles this for you).

Key files included
- `Dockerfile` — multi-stage build (build and runtime stages).
- `.dockerignore` — excludes local files from build context.
- `package.json` — `start` script respects `$PORT`.

## IMPORTANT: Build Method Configuration

**CRITICAL**: In Coolify, you MUST select "Dockerfile" as the build method, NOT "Nixpacks" or any other method. The Dockerfile handles the entire build process.

Deployment steps (in Coolify UI)
1. Create a new app and choose **"Dockerfile"** as the build method.
2. Point Coolify to this repository: `https://github.com/labhalamanojkumar/JSON.git`
3. **DO NOT** set any build commands manually - the Dockerfile handles everything.
4. Configure environment variables in Coolify's service settings (do NOT include secrets in the repo):
   - `MONGODB_URI` — your production MongoDB connection string
   - `MONGODB_DB=jsonformatter` — database name
   - `ADMIN_TOKEN` — secure token used for admin cookie (generate a random string)
   - `SUPERADMIN_USER=Superadmin` — admin username
   - `SUPERADMIN_PASS` — secure password for initial login
   - `NODE_ENV=production`
5. **Port Configuration**: The Dockerfile exposes port 3000, Coolify will map this automatically.
6. **Health Check**: ## Health Check
The app includes a `/api/health` endpoint that checks MySQL connectivity. The Dockerfile healthcheck probes this endpoint every 30 seconds using curl (installed in the runtime image). If the database is unreachable, the health check will fail (status 503), marking the container unhealthy in Coolify.

## Troubleshooting Build Issues

If you see build errors like "exit code: 240":
- **Ensure** you're using "Dockerfile" build method, not Nixpacks
- **Remove** any manual build commands from Coolify settings
- **Verify** all required environment variables are set
- **Check** Coolify logs for specific error messages

If you see MongoDB TLS certificate errors during build:
- **Fixed**: The app now handles build-time MongoDB connections gracefully
- **No action needed**: The latest code includes automatic build-time detection
- **Redeploy** with the updated code from the repository

## Quick Fix for Current Deployment

If you're seeing the build error, follow these steps in Coolify:

1. **Go to your Coolify project settings**
2. **Change Build Method**: Ensure it's set to "Dockerfile" (not Nixpacks)
3. **Remove Build Commands**: Delete any manual build commands like `npm ci --legacy-peer-deps && npm run build`
4. **Environment Variables**: Make sure these are set:
   - `MONGODB_URI` (your database connection)
   - `ADMIN_TOKEN` (random secure string)
   - `SUPERADMIN_USER=Superadmin`
   - `SUPERADMIN_PASS` (secure password)
   - `NODE_ENV=production`
5. **Redeploy**: Trigger a new deployment

The Dockerfile will handle the entire build process automatically.
