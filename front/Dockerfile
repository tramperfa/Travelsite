
FROM node:9.3

ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV APP_ENV $app_env

RUN mkdir /reactApp
WORKDIR /reactApp


COPY package.json ./
COPY ./src  ./
COPY ./public  ./

RUN npm install lint


CMD if [ ${APP_ENV} = production ]; \
	then \
 	npm run build; \
	else \
 	npm run start lint; \
	fi


EXPOSE 3000
