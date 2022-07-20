FROM node:current-alpine3.14

WORKDIR /app

COPY . .

RUN npm run install-all
RUN npm run build

EXPOSE 3010

CMD ["node", "server/src/index.js"]
