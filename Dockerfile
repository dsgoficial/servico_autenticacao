FROM node:12

WORKDIR /home/node/app

COPY . .

RUN npm run install-all
RUN npm run build
RUN npm run create-docs

EXPOSE 3012

CMD ["npm", "run", "start"]

