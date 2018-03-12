FROM node:boron
ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir /myserver

WORKDIR /myserver


COPY package.json ./
COPY aws.js ./
COPY .babelrc ./
COPY .eslintrc ./
COPY ./src  ./

RUN npm install

EXPOSE 8080
CMD ["npm", "start"]
