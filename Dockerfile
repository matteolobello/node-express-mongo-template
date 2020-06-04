FROM node:latest

#!/bin/sh

WORKDIR /backend-app

COPY . .

RUN npm install
RUN npm run build

RUN rm .env
COPY docker.env ./dist/.env

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["node", "dist/app.js"]