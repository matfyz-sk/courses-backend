FROM node:latest
FROM openjdk:8-jdk-alpine

WORKDIR /usr/src/courses

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 3010

CMD ["npm", "run", "prod"] 
