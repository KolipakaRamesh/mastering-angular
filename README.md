# Mastering Angular & ASP.NET Core

A hands-on full-stack application built while revisiting Angular 20 and integrating it with an ASP.NET Core 8.0 Web API. This repository demonstrates modern Angular concepts such as Standalone Components, Signals, Reactive Forms, Routing, Guards, Interceptors, Lazy Loading, Angular Material, and enterprise best practices, combined with a robust .NET security architecture featuring JWT-based Authentication, CORS policies, and role-based authorization.

---

## 🚀 Tech Stack

### Frontend
| Technology | Version |
|---|---|
| Angular | 20.x |
| Angular Material | 20.x |
| Angular CDK | 20.x |
| TypeScript | 5.9.x |
| RxJS | 7.8.x |
| SCSS | — |

### Backend
| Technology | Version |
|---|---|
| ASP.NET Core Web API | 8.0 |
| JWT Authentication | Microsoft.AspNetCore.Authentication.JwtBearer |
| C# | 12 |

---

## ✨ Concepts Covered

### Frontend (Angular)
- **Standalone Components** — No NgModules; components are self-contained
- **Signals** — Angular's new reactive primitive for state management and session handling
- **Reactive Forms** — Type-safe, dynamic form handling with validation
- **Routing & Lazy Loading** — Feature-based routes loaded on demand
- **Guards** — Route protection with `CanActivate` functional guards
- **Interceptors** — HTTP middleware for managing global loading state and attaching JWT headers (`auth.interceptor.ts`)
- **Angular Material** — Pre-built UI components following Material Design
- **Enterprise Structure** — `core/`, `features/`, `shared/` folder architecture

### Backend (ASP.NET Core)
- **JWT Token Generation & Validation** — Custom token service generating secure signed payloads (`HMACSHA256`)
- **ASP.NET Core Middleware Pipeline** — Strict execution ordering for CORS, Authentication, and Authorization
- **Dependency Injection** — Clean abstraction mapping (e.g., `ITokenService` to `TokenService`)
- **Startup Fast-Failing Validation** — Validates configuration secrets (JWT Secret, Admin User) immediately at startup
- **CORS Configuration** — Restricts resource access to defined client origins (e.g., Angular development server)

---

## 📁 Project Structure

```
.
├── backend/
│   └── EmpManager.API/                 # ASP.NET Core Web API
│       ├── Controllers/                # Controllers (Authentication, etc.)
│       ├── Models/                     # Request/Response models & configuration settings
│       ├── Services/                   # Token service abstraction & implementation
│       ├── Program.cs                  # Web application entry point
│       └── appsettings.Development.json # Development configuration overrides (JWT keys, dev credentials)
│
└── src/                                # Angular Frontend
    ├── app/
    │   ├── core/
    │   │   ├── guards/                 # Route guards (auth.guard.ts, etc.)
    │   │   ├── interceptors/           # HTTP interceptors (auth, loading)
    │   │   ├── models/                 # TypeScript interfaces & models
    │   │   └── services/               # Singleton services (AuthService, etc.)
    │   ├── features/
    │   │   ├── about/                  # About page (lazy loaded)
    │   │   ├── auth/                   # Authentication feature (login component)
    │   │   ├── dashboard/              # Dashboard feature (lazy loaded)
    │   │   ├── employees/              # Employee list, form, detail (lazy loaded)
    │   │   └── not-found/              # 404 page (lazy loaded)
    │   ├── shared/
    │   │   ├── components/             # Reusable UI components
    │   │   ├── directives/             # Custom directives
    │   │   └── pipes/                  # Custom pipes
    │   ├── app.ts                      # Root component
    │   ├── app.config.ts               # App-level providers & config
    │   └── app.routes.ts               # Top-level routing
    ├── assets/
    │   └── data/                       # Mock JSON data
    ├── environments/                   # Environment configs (dev / prod)
    └── main.ts                         # Application entry point
```

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Angular CLI](https://angular.dev/tools/cli) v20
- [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)

### 1. Backend Setup (ASP.NET Core API)
Change directory into the API folder and run the project:
```bash
cd backend/EmpManager.API
dotnet run
```
The API will start and listen on **http://localhost:5225/**.

### 2. Frontend Setup (Angular)
In the project root, install the dependencies and start the Angular development server:
```bash
# Install packages
npm install

# Start the server
npm start
# or
ng serve
```
Open your browser at **http://localhost:4200/**. The app hot-reloads on file changes.

### 🔐 Development Login Credentials
Use the following credentials to log in during development:
- **Username:** `admin`
- **Password:** `admin123`

---

## 🐳 Docker Deployment (Local)

You can run the entire full-stack application (both Angular frontend and ASP.NET Core backend) locally using Docker and Docker Compose.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Run with Docker Compose

1. **Build and start the containers**:
   From the repository root directory, run:
   ```bash
   docker-compose up --build -d
   ```
   This will:
   - Compile the Angular frontend and serve it using Nginx on **http://localhost:4200/**.
   - Compile the ASP.NET Core Web API backend and run it on **http://localhost:5225/**.
   - Automatically configure CORS and API URLs for local container communication.

2. **Verify containers are running**:
   ```bash
   docker ps
   ```

3. **Access the application**:
   Open your browser and navigate to **http://localhost:4200/**.
   Log in with the development credentials:
   - **Username:** `admin`
   - **Password:** `admin123`

4. **Teardown**:
   To stop and remove the containers, run:
   ```bash
   docker-compose down
   ```

---

## 📖 Additional Resources
- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [Microsoft .NET Core Docs](https://docs.microsoft.com/en-us/dotnet/)
