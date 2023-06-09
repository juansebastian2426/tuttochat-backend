FROM node:16 as builder

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --production

COPY --from=builder /usr/src/app/build ./build

EXPOSE 9876

CMD [ "node", "build/server.js" ]