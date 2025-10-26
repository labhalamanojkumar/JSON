## Multi-stage Dockerfile for Next.js production build
## Builds the app and runs it with `next start`.

FROM node:20 AS builder
WORKDIR /app

# Install dependencies (including dev for build)
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Install production dependencies
RUN if [ -f package-lock.json ]; then \
    npm ci --omit=dev --legacy-peer-deps; \
  else \
    npm install --omit=dev --legacy-peer-deps; \
  fi

EXPOSE 3000

## Install minimal utilities (curl for healthcheck) and ensure proper permissions
RUN apt-get update \
	&& apt-get install -y --no-install-recommends curl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

## Create non-root user for runtime and ensure /app is writable
RUN addgroup --system app \
	&& adduser --system --ingroup app app || true \
	&& chown -R app:app /app

USER app

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
	CMD curl -fsS --retry 2 http://localhost:3000/api/health || exit 1

CMD ["npm", "start"]
