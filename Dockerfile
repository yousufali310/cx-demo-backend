# Use Node.js base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# ✅ Copy .env file
COPY .env .env

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 8000

# Start app
CMD ["npm", "run", "dev"]
