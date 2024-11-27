FROM node:latest

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

ARG DATABASE_URL

COPY package*.json ./

COPY . .

RUN npm install

USER node

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "npm", "start" ]