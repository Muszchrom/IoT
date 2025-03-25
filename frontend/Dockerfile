FROM node:22.14.0-alpine3.20 AS base
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json

FROM base AS deps
RUN npm ci

FROM base AS builder
ENV NEXT_PRIVATE_STANDALONE true
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20.16.0-alpine AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]

FROM base AS dev
ENV NEXT_WEBPACK_USEPOLLING=true
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "dev"]