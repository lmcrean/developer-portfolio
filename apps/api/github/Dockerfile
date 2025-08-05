# Use minimal Node.js image for smallest footprint
FROM node:18-alpine

# Install Python and build dependencies for native modules
RUN apk add --no-cache python3 make g++ py3-setuptools

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port (Cloud Run requires PORT env variable)
EXPOSE 8080

# Set production environment
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"] 