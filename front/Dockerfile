# Multi-stage build for Angular Frontend
# Stage 1: Build the Angular app
FROM node:24.3-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Npm install
RUN npm install

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Angular app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build /app/dist/abubakkar-apps/browser /usr/share/nginx/html

# Copy custom nginx configuration if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
