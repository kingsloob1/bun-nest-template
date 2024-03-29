FROM oven/bun:latest

WORKDIR /home/bun/app

COPY package*.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY bun.lockb ./

RUN bun install -g nest typeorm
RUN bun install

USER root

COPY --chown=node:node . .

EXPOSE 5011

CMD [ "bun", "start" ]
