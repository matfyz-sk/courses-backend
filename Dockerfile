FROM node:latest

WORKDIR /usr/src/courses-backend

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 3010

CMD ["npm", "run", "prod"] 
