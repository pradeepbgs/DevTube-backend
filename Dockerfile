# Use node 18 as the base image
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /build

# Install Redis
RUN apt-get update && apt-get install -y redis-server

# Copy Redis configuration (optional)
# COPY redis.conf /etc/redis/redis.conf

# Copy application files and install dependencies
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

# Expose the port for your Node.js application
EXPOSE 3000

# Start Redis and your application
CMD ["sh", "-c", "redis-server /etc/redis/redis.conf && yarn start"]
