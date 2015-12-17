FROM ubuntu:14.04.1

RUN apt-get update \
#  && apt-get install -y libaio1 \
#  && apt-get install -y build-essential \
#  && apt-get install -y unzip \
  && apt-get install -y curl \
#  && apt-get install -y python \
  && apt-get install -y git \
  && rm -rf /var/lib/apt/lists/*

ENV NLS_LANG="AMERICAN_AMERICA.UTF8"

ENV NODE_VERSION 5.0.0
ENV NPM_VERSION 3.3.6
ENV NODE_PATH /usr/local/lib/node_modules 

#RUN gpg --keyserver pool.sks-keyservers.net --recv-keys 7937DFD2AB06298B2293C3187D33FF9D0246406D 114F43EE0176B71C7BC219DD50A3051F888C628D

RUN curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
  && curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
#  && gpg --verify SHASUMS256.txt.asc \
#  && grep " node-v$NODE_VERSION-linux-x64.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c - \
  && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.gz" SHASUMS256.txt.asc \
  && npm install -g npm@"$NPM_VERSION" \
  && npm cache clear