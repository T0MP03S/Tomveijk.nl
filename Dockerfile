FROM node:18-bullseye-slim AS base

# Install dependencies only when needed
FROM base AS deps
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates wget libvips-dev \
  && rm -rf /var/lib/apt/lists/*

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Prisma CLI (needed for migrate deploy at container start)
COPY --from=deps /app/node_modules/.bin ./node_modules/.bin
COPY --from=deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma

# Admin seed script
COPY --from=builder /app/scripts ./scripts

# Ensure dependencies for seed script and runtime exist
COPY --from=deps /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=deps /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/sharp ./node_modules/sharp

# Nodemailer for email sending
COPY --from=deps /app/node_modules/nodemailer ./node_modules/nodemailer

# Entrypoint
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Create data directories for SQLite, uploads and cache
RUN mkdir -p /app/data /app/data/uploads /app/.next/cache && chown -R nextjs:nodejs /app/data /app/.next/cache

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
