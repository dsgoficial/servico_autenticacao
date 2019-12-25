FROM node:12

WORKDIR /home/node/app

COPY package.json ./
COPY package-lock.json ./
COPY yarn.lock ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 5000

CMD serve -s build

