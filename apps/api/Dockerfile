FROM node:22-slim AS base

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY pnpm-11.19.0.tgz ./
COPY .npmrc ./

RUN npm install -g ./pnpm-11.19.0.tgz

RUN pnpm --version

COPY apps/api/package.json apps/api/package.json
COPY packages/database/package.json packages/database/package.json

RUN pnpm install --frozen-lockfile --filter @hemayatgar/api...

FROM base AS build

COPY --from=deps /app /app
COPY . .

RUN pnpm --filter @hemayatgar/database prisma:generate
RUN pnpm --filter @hemayatgar/api build

FROM base AS runner

ENV NODE_ENV=production

COPY --from=build /app /app

EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]
