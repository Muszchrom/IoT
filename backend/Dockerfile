FROM node:22.14.0-alpine3.20 AS base
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json

FROM base AS deps
RUN npm ci

FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "dev"]