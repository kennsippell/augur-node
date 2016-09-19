FROM node:4.4.4
MAINTAINER Kevin Day (@k_day)

RUN useradd --user-group --create-home --shell /bin/false augur &&\
  npm install --global npm@3.9.3

ENV HOME=/home/augur

COPY package.json npm-shrinkwrap.json $HOME/
RUN chown -R augur:augur $HOME/*

USER augur
WORKDIR $HOME
RUN npm install

CMD ["node","index.js"]
