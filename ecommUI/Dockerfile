FROM node:12.9.0-alpine

RUN mkdir /src

WORKDIR /src

COPY package*.json /src/

RUN npm install -g @angular/cli

RUN npm install

COPY . /src/
