FROM node:buster
WORKDIR /usr/src/app

COPY package.json ./

RUN apt-get update &&\
    apt-get install -y g++ make && \
    apt-get install -y sqlite && \
    mkdir sqlite && \
    chmod 777 -R sqlite && \
    yarn

COPY . .

EXPOSE 3000

CMD yarn initdb & yarn start
