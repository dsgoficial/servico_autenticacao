# Use Node.js LTS Alpine image as base
FROM node:22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set up client build
WORKDIR /app/client
COPY client/package.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Set up server build
WORKDIR /app/server
COPY server/package.json ./
RUN npm install
COPY server/ ./

# Copy client build to server directory
RUN mkdir -p /app/server/src/build
COPY --from=0 /app/client/build /app/server/src/build

# Build the server
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy server package files and install production dependencies only
COPY --from=builder /app/server/package.json ./
RUN npm install --omit=dev

# Copy built application
COPY --from=builder /app/server/dist ./dist
RUN mkdir -p /dist/build
COPY --from=builder /app/server/src/build ./dist/build

# Create logs directory
RUN mkdir -p logs

# Expose the application port
EXPOSE 3010

# Use non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Start the application
CMD ["node", "dist/index.js"]