FROM node:boron

ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV APP_ENV $app_env

RUN mkdir -p /reactApp
WORKDIR /reactApp
RUN npm install

CMD if [ ${APP_ENV} = production ]; \
	then \
	npm run build; \
	else \
	npm run start; \
	fi

COPY  . ./reactApp
EXPOSE 3000
