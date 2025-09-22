# build env
FROM node:20-alpine as build

WORKDIR /app

RUN apk add --no-cache git=~2
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive && yarn cache clean
COPY . .
RUN yarn typechain && yarn build

# final image
FROM node:20-alpine as base

ARG BASE_PATH=""
ENV BASE_PATH=$BASE_PATH
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app
RUN apk add --no-cache curl=~8
COPY --from=build /app /app

RUN mkdir -p /app/.next/cache/images && chown -R node:node /app/.next/cache/images
VOLUME /app/.next/cache/images

USER node
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["yarn", "start"]
