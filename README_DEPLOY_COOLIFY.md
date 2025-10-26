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
6. **Health Check**: The app includes a `/api/health` endpoint for monitoring.

## Troubleshooting Build Issues

If you see build errors like "exit code: 240":
- **Ensure** you're using "Dockerfile" build method, not Nixpacks
- **Remove** any manual build commands from Coolify settings
- **Verify** all required environment variables are set
- **Check** Coolify logs for specific error messages

## Alternative: Manual Docker Build

If Coolify continues to have issues, you can build and push the image manually:

```bash
# Build the image
docker build -t jsonformatterpro .

# Tag for your registry
docker tag jsonformatterpro your-registry/jsonformatterpro:latest

# Push to registry
docker push your-registry/jsonformatterpro:latest
```

Then deploy the pre-built image in Coolify.
