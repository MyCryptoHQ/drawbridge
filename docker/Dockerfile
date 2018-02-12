FROM node:8.9.4

RUN apt-get update && apt-get install libusb-1.0 nasm

VOLUME ["/appDir"]

WORKDIR /appDir

ENTRYPOINT [ "/bin/bash", "-c" ]
