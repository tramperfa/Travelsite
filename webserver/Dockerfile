FROM node:boron
ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir /myserver

WORKDIR /myserver


COPY package.json ./
COPY .babelrc ./
COPY ./src  ./

RUN npm install

EXPOSE 8080
CMD ["npm", "start"]
