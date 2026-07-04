# Stage 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Inject the backend URL at build-time using the build arg
ARG BACKEND_URL
RUN if [ -n "$BACKEND_URL" ]; then \
      sed -i "s|backendUrl: 'http://localhost:5225'|backendUrl: '$BACKEND_URL'|g" src/environments/environment.prod.ts; \
    fi

# Build the project in production configuration
RUN npm run build -- --configuration=production

# Stage 2: Serve the application using Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/mastering-angular/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]