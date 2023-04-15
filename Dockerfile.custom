FROM node:16

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 9876

CMD [ "node", "build/server.js" ]