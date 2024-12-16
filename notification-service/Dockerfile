FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application files
COPY . .

# Expose the application port (optional, since it's a background process)
EXPOSE 3000

# Command to run the app
CMD ["node", "src/server.js"]
