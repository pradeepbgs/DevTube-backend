# Use node 18 as the base image
FROM node:18 as builder

# Set the working directory
WORKDIR /build

COPY package*.json ./
RUN npm install

COPY public/ public/
COPY src/ src/
COPY .env .env
COPY .env.sample .env.sample
COPY .gitignore .gitignore
COPY .prettierignore .prettierignore
COPY .prettierrc .prettierrc
COPY README.md README.md

EXPOSE 3000

CMD ["npm", "start"]
