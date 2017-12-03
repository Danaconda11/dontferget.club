FROM node:latest
ADD src /app
WORKDIR /app
RUN npm install
EXPOSE 25
CMD ["/usr/local/bin/npm", "run", "haraka"]
