FROM node:22.14.0

LABEL maintainer="Victor Singh singh.r.victor@gmail.com"
LABEL description="Fragments node.js microservice"

ENV PORT=8080

ENV NPM_CONFIG_LOGLEVEL=warn

ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./src

COPY ./tests/.htpasswd ./tests/.htpasswd

CMD npm run docker-start

EXPOSE 8080
