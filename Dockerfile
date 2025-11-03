FROM node:22.14.0 AS builder

LABEL maintainer="Victor Singh singh.r.victor@gmail.com"
LABEL description="Fragments node.js microservice"

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY ./src ./src

COPY ./tests/.htpasswd ./tests/.htpasswd



FROM node:22.14.0-slim AS runtime

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY --from=builder /app/src ./src

COPY --from=builder /app/tests/.htpasswd ./tests/.htpasswd

ENV PORT=8080

EXPOSE 8080

ENV NPM_CONFIG_LOGLEVEL=warn

ENV NPM_CONFIG_COLOR=false

CMD ["npm", "run", "docker-start"]