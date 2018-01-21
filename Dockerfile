FROM node:slim
WORKDIR /app
ADD . /app

RUN npm i --production

# RUN npm i -g modclean
# RUN modclean -r

EXPOSE 3000
ENV NAME Webserver
CMD ["node", "index.js"]
