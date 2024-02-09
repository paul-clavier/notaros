FROM node:18-alpine as dev
# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --omit=dev
RUN npm install -g prisma
RUN npm install -g nest

COPY . .

RUN prisma generate
RUN npm run build

EXPOSE 3000
CMD [ "node", "dist/src/main.js" ]
