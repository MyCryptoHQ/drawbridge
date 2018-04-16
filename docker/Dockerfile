FROM node:8.9.4

RUN apt-get update && apt-get install -y libusb-1.0 nasm graphicsmagick

VOLUME ["/appDir"]

WORKDIR /appDir

ENTRYPOINT [ "/bin/bash", "-c" ]
