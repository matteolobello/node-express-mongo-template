FROM node:latest

#!/bin/sh

WORKDIR /backend-app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["node", "dist/app.js"]