FROM node:boron

RUN mkdir /myserver
WORKDIR /myserver
COPY package.json /myserver
RUN npm install
COPY . /myserver
EXPOSE 8080
CMD ["npm", "start"]
