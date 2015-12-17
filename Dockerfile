FROM ubuntu:14.04.1

ENV INSTALL_ORACLE=
ENV INSTALL_MYSQL=1


RUN apt-get update \
  && apt-get install -y curl \
  && apt-get install -y git

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


# ORACLE stuff

ADD instantclient-basic-linux.x64-12.1.0.2.0.zip /
ADD instantclient-sdk-linux.x64-12.1.0.2.0.zip /
RUN if [ -n "$INSTALL_ORACLE" ]; then \
  apt-get install -y libaio1 build-essential unzip python \
  && mkdir /opt/oracle \
  && unzip /instantclient-basic-linux.x64-12.1.0.2.0.zip -d /opt/oracle \
  && unzip /instantclient-sdk-linux.x64-12.1.0.2.0.zip -d /opt/oracle \
  && mv /opt/oracle/instantclient_12_1 /opt/oracle/instantclient \
  && ln -s /opt/oracle/instantclient/libclntsh.so.12.1 /opt/oracle/instantclient/libclntsh.so \
  && export LD_LIBRARY_PATH="/opt/oracle/instantclient" \
  && export OCI_LIB_DIR="/opt/oracle/instantclient" \
  && export OCI_INC_DIR="/opt/oracle/instantclient/sdk/include" \
  && git clone --depth 1 --branch master \
    https://github.com/Bigous/node-oracledb.git \
  && chdir node-oracledb \
  && sudo npm update \
  && sed -i 's/ <5/ <6/g' package.json \
  && sudo npm install --unsafe-perm -g \
  && chdir / \
  && rm -R node-oracledb \
  ; \
fi

RUN rm -rf /var/lib/apt/lists/*