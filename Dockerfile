FROM node:alpine
WORKDIR /usr/src/app

COPY package.json ./

RUN apk add sqlite ; \
    mkdir sqlite ; \
    yarn

COPY . .

EXPOSE 3000

CMD yarn initdb & yarn start