FROM node:12

WORKDIR /home/node/app

COPY . .

RUN npm run install-all
RUN npm run create-docs
RUN npm run build

EXPOSE 3010

CMD ["npm", "run", "start"]

