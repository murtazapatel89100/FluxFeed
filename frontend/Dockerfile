FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app


FROM base AS development-dependencies-env

COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install

COPY frontend/ ./


FROM base AS production-dependencies-env

COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --prod


FROM base AS build-env

COPY frontend/ ./
COPY --from=development-dependencies-env /app/node_modules /app/node_modules

RUN pnpm run build


FROM node:20-alpine

RUN corepack enable
WORKDIR /app

COPY frontend/package.json frontend/pnpm-lock.yaml ./
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build

EXPOSE 3000

CMD ["pnpm", "run", "start"]
