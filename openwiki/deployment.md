
# Deployment

The Employee Management System is designed to be easily deployed using Docker. The repository includes a `Dockerfile` for both the frontend and backend, as well as a `docker-compose.yml` file for running the entire application.

## Docker

To build and run the application with Docker, use the following command:

```bash
docker-compose up -d --build
```

This will build the Docker images for the frontend and backend and start the containers in detached mode.

### `Dockerfile`

The `Dockerfile` for the Angular frontend uses a multi-stage build to create a small, optimized NGINX image. The `Dockerfile` for the ASP.NET Core backend builds the application and sets it up to run in a container.

### `nginx.conf`

The `nginx.conf` file configures NGINX to serve the Angular application and act as a reverse proxy for the backend API. This allows the frontend and backend to be served from the same domain, which simplifies the configuration and avoids CORS issues.

## Environments

The application is configured to be deployed to different environments. The `src/environments/` directory contains environment-specific configuration for the Angular frontend, and the `backend/EmpManager.API/appsettings.json` file contains configuration for the ASP.NET Core backend.
