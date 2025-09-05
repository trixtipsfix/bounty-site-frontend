# Development Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 80

# Set port environment variable
ENV PORT 80

# Start development server
CMD ["npm", "run", "dev"]