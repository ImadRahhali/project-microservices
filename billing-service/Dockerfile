# Use an official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available) into the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your application files into the container
COPY . .

# Expose the port your app will be running on (if you have an HTTP server, e.g., port 3000)
EXPOSE 6000

# Command to run the application
CMD ["node", "src/server.js"]  
