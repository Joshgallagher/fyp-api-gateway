# Base build
FROM node:10.16.0 as base

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production \
    && npm cache clean --force

# Development build
FROM base as dev

ENV NODE_ENV=development

RUN npm install --only=development

CMD [ "npm", "run", "start:dev" ]
