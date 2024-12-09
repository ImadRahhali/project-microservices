# Use Node.js 18 on Alpine
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to utilize Docker caching
COPY package.json package-lock.json ./

# Install dependencies using npm ci (faster and more reliable for CI environments)
RUN npm ci

# Copy the rest of the application code into the container
COPY . .

# Expose the application port (3000 for customer-service, 4000 for vehicle-service)
EXPOSE 3000

# Default command to run the app and execute Prisma migrations and client generation
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run start"]