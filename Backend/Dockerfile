# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose backend port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
