FROM node:7.6.0

RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app
ENV NODE_ENV "production"
CMD ["npm", "start"]