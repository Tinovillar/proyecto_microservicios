FROM node:20.12.2-alpine
WORKDIR /
COPY package*.json ./
RUN npm install --only-production
COPY . .
EXPOSE 4141
CMD npm start