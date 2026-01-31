FROM node:18-alpine

# This line fixes the crash by installing tools needed for bcrypt
RUN apk add --no-cache python3 make g++ curl

WORKDIR /app

COPY package*.json ./

# This rebuilds bcrypt for the Docker environment
RUN npm install && npm rebuild bcrypt --build-from-source

COPY . .

CMD ["npm", "start"]