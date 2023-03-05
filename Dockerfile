FROM node:18

RUN apt-get update && apt-get install default-jre -y

WORKDIR /usr/src/courses

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 3010

CMD ["npm", "run", "prod"]
