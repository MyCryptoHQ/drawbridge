FROM node:8.16.0

RUN echo "deb [check-valid-until=no] http://archive.debian.org/debian jessie-backports main" > /etc/apt/sources.list.d/jessie-backports.list

RUN sed -i '/deb http:\/\/deb.debian.org\/debian jessie-updates main/d' /etc/apt/sources.list

RUN apt-get -o Acquire::Check-Valid-Until=false update && apt-get install -y libusb-1.0 nasm graphicsmagick libudev-dev

VOLUME ["/appDir"]

WORKDIR /appDir

ENTRYPOINT [ "/bin/bash", "-c" ]
