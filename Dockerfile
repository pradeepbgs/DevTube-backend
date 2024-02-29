# Use node 18 as the base image
FROM node:18 as builder

# Set the working directory
WORKDIR /build

# Install Redis
RUN apt-get update && apt-get install -y redis-server

# Set up Redis configuration (optional)
COPY redis.conf /etc/redis/redis.conf

COPY package*.json ./
RUN yarn install

COPY public/ public/
COPY src/ src/
COPY .env .env
COPY .env.sample .env.sample
COPY .gitignore .gitignore
COPY .prettierignore .prettierignore
COPY .prettierrc .prettierrc
COPY README.md README.md


CMD ["sh", "-c", "service redis-server start && yarn start"]
