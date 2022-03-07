FROM node:latest

WORKDIR /home/runner/work/courses-backend/courses-backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 3010

CMD ["npm", "run", "prod"] 
