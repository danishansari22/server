FROM node:18
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci

COPY . .

EXPOSE 3001

CMD [ "node", "server.js" ]

