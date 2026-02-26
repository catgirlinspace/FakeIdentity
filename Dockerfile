FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun build --compile --minify src/index.ts --outfile server

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=build /app/server server

ENV NODE_ENV=production
EXPOSE 3000

ENTRYPOINT ["/app/server"]