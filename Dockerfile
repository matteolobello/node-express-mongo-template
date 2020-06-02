FROM node:latest

#!/bin/sh

WORKDIR /my-app

COPY . .

RUN npm install
RUN npm run build

COPY .env.docker ./dist/.env

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["node", "dist/app.js"]