FROM node:lts-alpine

# installs a simple http server to serve static content
RUN npm install -g http-server

# sets the 'app' folder as working folder
WORKDIR /app

# copy 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# Installs project dependencies
RUN npm install

# copies the files and folders of the project to the working folder (for example: 'app' folder)
COPY . .

# builds the app for production by minimising
RUN npm run build

EXPOSE 8081

CMD [ "http-server", "dist", "-p", "8081" ]