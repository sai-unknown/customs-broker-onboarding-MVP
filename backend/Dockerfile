FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache dumb-init wget

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY database ./database

RUN chown -R node:node /app

ENV NODE_ENV=production

EXPOSE 5000

USER node

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
