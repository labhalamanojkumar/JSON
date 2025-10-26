## Multi-stage Dockerfile for deploying Next.js app to Coolify (VPS)

# Builder: install deps and build the app
FROM node:20-slim AS builder
WORKDIR /app

# Install build-time dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# Runner: smaller image that only contains production artifacts
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only the production artifacts from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js

# Note: we copy node_modules from the builder so next (in devDependencies)
# is available at runtime. This avoids installing with --omit=dev which
# would remove Next when it's listed under devDependencies.

# Create non-root user and set permissions for /app
RUN groupadd -r app && useradd -r -g app app || true
RUN chown -R app:app /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

USER app

EXPOSE ${PORT}

# Minimal healthcheck endpoint (optional, Coolify will probe the container's port)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
	CMD curl -fsS --retry 2 http://localhost:${PORT}/api/health || exit 1

# Start the app using the start script which binds to $PORT
CMD ["npm", "start"]
