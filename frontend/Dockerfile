FROM node:lts-alpine

# sets the 'app' folder as working folde
WORKDIR /app

# copy 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# Installs project dependencies
RUN npm install

# copies the files and folders of the project to the working folder (for example: 'app' folder)
COPY . .

EXPOSE 8081

CMD npm run build && npx cap sync && node server.js
