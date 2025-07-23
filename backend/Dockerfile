FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copiar el script
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

EXPOSE 3001

CMD [ "bash", "-c", "./wait-for-it.sh mongo:27017 -- node server.js" ]
