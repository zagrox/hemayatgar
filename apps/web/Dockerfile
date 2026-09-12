FROM node:22-slim AS base

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY pnpm-11.19.0.tgz ./
COPY .npmrc ./

RUN npm install -g ./pnpm-11.19.0.tgz

RUN pnpm --version

COPY apps/web/package.json apps/web/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install --frozen-lockfile --filter @hemayatgar/web...

FROM base AS build

COPY --from=deps /app /app
COPY . .

RUN pnpm --filter @hemayatgar/web build

FROM base AS runner

ENV NODE_ENV=production

COPY --from=build /app /app

EXPOSE 3000

CMD ["pnpm", "--filter", "@hemayatgar/web", "start"]
