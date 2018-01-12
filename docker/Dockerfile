FROM node:latest

RUN apt-get update && apt-get install libusb-1.0

VOLUME ["/appDir"]

ENTRYPOINT [ "/bin/bash", "-c", "cd /appDir && npm install && npm run build" ]
