FROM node:18-alpine
RUN apk add --no-cache python3 make g++

WORKDIR /simple-remixjs


COPY package.json ./
RUN yarn install

COPY . .
RUN yarn run nx build simple-remixjs

CMD ["yarn", "run", "nx", "start", "simple-remixjs"]
