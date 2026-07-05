
# Development Guide

This guide provides instructions for setting up and running the Employee Management System in a local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+)
- [Angular CLI](https://angular.dev/tools/cli) v20
- [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker](https://www.docker.com/)

## Local Development

To run the application locally, you can either run the frontend and backend separately or use Docker Compose to run them together.

### Running Separately

1.  **Backend:**

    ```bash
    cd backend/EmpManager.API
    dotnet run
    ```

2.  **Frontend:**

    ```bash
    npm install
    npm start
    ```

### Running with Docker Compose

```bash
docker-compose up -d --build
```

## Code Style & Conventions

Please follow the existing code style and conventions when contributing to the project. The project uses the default style guides for Angular and ASP.NET Core.
