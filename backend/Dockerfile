# Mudamos de alpine para slim (Debian) para resolver o problema do SSL
FROM node:22-slim

# Instalamos o OpenSSL necessário para o Prisma
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# O comando de start será controlado pelo docker-compose,
# mas deixamos um padrão aqui por segurança
CMD ["npm", "run", "dev"]