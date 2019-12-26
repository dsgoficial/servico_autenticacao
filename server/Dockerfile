FROM node:12

WORKDIR /home/node/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3012

CMD ["npm", "run", "production"]