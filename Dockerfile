# Stage 1: Build the Angular application
FROM node:18-alpine AS build
WORKDIR /app

# Set NODE_OPTIONS to increase memory available to the build process
ENV NODE_OPTIONS=--max-old-space-size=4096

COPY package*.json ./
RUN npm install

COPY . .
# Run the production build as defined in angular.json
RUN npm run build -- --configuration production

# Stage 2: Serve the application from Nginx
FROM nginx:alpine

# Copy the build artifacts from the correct, confirmed path
COPY --from=build /app/dist/onai-pharmaceutical-frontend/browser/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
