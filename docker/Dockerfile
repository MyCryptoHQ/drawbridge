FROM node:latest

VOLUME ["/appDir"]

ENTRYPOINT [ "/bin/bash", "-c", "cd /appDir && npm install && npm run build" ]
