
# Frontend (Angular)

The frontend of the Employee Management System is a single-page application built with Angular 20. It follows a modern, modular architecture and utilizes many of the latest features of the framework.

## Project Structure

The frontend code is located in the `src/` directory. The structure is organized as follows:

- **`app/core/`:** Contains core services, guards, and interceptors that are used throughout the application.
- **`app/features/`:** Contains the different feature modules of the application, such as the dashboard, employees, and authentication.
- **`app/shared/`:** Contains shared components, directives, and pipes that can be reused across different feature modules.

## Key Concepts

The frontend code demonstrates a number of important Angular concepts:

- **Standalone Components:** The application is built entirely with standalone components, which simplifies the architecture and improves performance.
- **Signals:** Signals are used for state management, providing a reactive and efficient way to handle data changes.
- **Reactive Forms:** Reactive forms are used for handling user input, providing a robust and scalable way to manage forms.
- **Routing & Lazy Loading:** The application uses lazy loading to load feature modules on demand, which improves the initial load time.
- **Guards:** Route guards are used to protect routes and ensure that only authorized users can access certain parts of the application.
- **Interceptors:** HTTP interceptors are used to manage global loading state and attach JWT headers to outgoing requests.

## Development

To run the frontend in development, use the following command:

```bash
npm start
```
This will start a development server on `http://localhost:4200`.
