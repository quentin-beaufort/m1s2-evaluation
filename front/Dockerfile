# Build phase
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Serveur web Nginx pour la prod
FROM nginx:alpine
COPY --from=builder /app/dist/* /usr/share/nginx/html
EXPOSE 80
