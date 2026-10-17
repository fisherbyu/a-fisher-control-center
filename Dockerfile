# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# ── Dependencies Stage ──────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ── Builder Stage ────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── Runner Stage ─────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Standalone output bundles everything needed. Owned by node so Next.js can write its .next/cache
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run as the image's built-in node user (uid 1000), not root, so the container can drop all
# Linux capabilities. /data (later: invites and access levels) is owned by uid 1000 on the server.
USER node

# Runtime config comes from the stack's .env at docker run; who's logged in comes from the
# Remote-* headers nginx sets from Authelia
CMD ["node", "server.js"]
