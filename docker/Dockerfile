FROM node:8.9.4

RUN apt-get update && apt-get install libusb-1.0

VOLUME ["/appDir"]

ENTRYPOINT [ "/bin/bash", "-c", "cd /appDir && $BUILD_COMMAND" ]
