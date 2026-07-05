
# Backend (ASP.NET Core)

The backend of the Employee Management System is an ASP.NET Core Web API. It provides a secure and robust API for the Angular frontend.

## Project Structure

The backend code is located in the `backend/EmpManager.API/` directory. The structure is organized as follows:

- **`Controllers/`:** Contains the API controllers, which handle incoming HTTP requests.
- **`Models/`:** Contains the data models used by the application.
- **`Services/`:** Contains the business logic of the application, such as the token service for JWT authentication.

## API Endpoints

The backend exposes a number of API endpoints for the frontend to consume. The main endpoints are:

- **`POST /api/Authentication/login`:** Authenticates a user and returns a JWT token.

## Authentication & Authorization

The backend uses JWT-based authentication to secure the API. The `TokenService` is responsible for generating and validating JWT tokens. The `[Authorize]` attribute is used to protect API endpoints and ensure that only authenticated users can access them.

## Development

To run the backend in development, use the following command:

```bash
dotnet run
```

This will start the backend server on `http://localhost:5000`.
