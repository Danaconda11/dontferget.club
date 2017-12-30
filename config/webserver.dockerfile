FROM node:9.2
ADD src /app
WORKDIR /app
# TODO josh: build the frontend JS client side so we can avoid installing
# prod npm dependencies
RUN npm install
RUN npm run build:production
EXPOSE 80
CMD ["/usr/local/bin/node", "/app/index.js"]
