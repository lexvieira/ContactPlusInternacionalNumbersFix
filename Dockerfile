FROM node:latest

WORKDIR /opt/ui

RUN apt-get update 

RUN npm install -g react-native-cli

ENV PATH="$(npm global bin):$PATH"

USER 1000

CMD ["node", "-v"]