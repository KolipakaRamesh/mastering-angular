# Mastering Angular

A hands-on Angular 20 project built while revisiting Angular after several years. This repository demonstrates modern Angular concepts such as Standalone Components, Signals, Reactive Forms, Routing, Guards, Interceptors, Lazy Loading, Angular Material, and enterprise best practices.

---

## 🚀 Tech Stack

| Technology | Version |
|---|---|
| Angular | 20.x |
| Angular Material | 20.x |
| Angular CDK | 20.x |
| TypeScript | 5.9.x |
| RxJS | 7.8.x |
| SCSS | — |

---

## ✨ Concepts Covered

- **Standalone Components** — No NgModules; components are self-contained
- **Signals** — Angular's new reactive primitive for state management
- **Reactive Forms** — Type-safe, dynamic form handling with validation
- **Routing & Lazy Loading** — Feature-based routes loaded on demand
- **Guards** — Route protection with `CanActivate` functional guards
- **Interceptors** — HTTP middleware for loading state and request handling
- **Angular Material** — Pre-built UI components following Material Design
- **Enterprise Structure** — `core/`, `features/`, `shared/` folder architecture

---

## 📁 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # Route guards (auth, etc.)
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── models/          # TypeScript interfaces & models
│   │   └── services/        # Singleton services
│   ├── features/
│   │   ├── dashboard/       # Dashboard feature (lazy loaded)
│   │   ├── employees/       # Employee list, form, detail (lazy loaded)
│   │   ├── about/           # About page (lazy loaded)
│   │   └── not-found/       # 404 page (lazy loaded)
│   ├── shared/
│   │   ├── components/      # Reusable UI components
│   │   ├── directives/      # Custom directives
│   │   └── pipes/           # Custom pipes
│   ├── app.ts               # Root component
│   ├── app.config.ts        # App-level providers & config
│   └── app.routes.ts        # Top-level routing
├── assets/
│   └── data/                # Mock JSON data
├── environments/            # Environment configs (dev / prod)
├── styles.scss              # Global styles
└── main.ts                  # Application entry point
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Angular CLI](https://angular.dev/tools/cli) v20

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
# or
ng serve
```

Open your browser at **http://localhost:4200/**. The app hot-reloads on file changes.

### Production Build

```bash
npm run build
```

Build artifacts are output to `dist/mastering-angular/`.

### Run Unit Tests

```bash
npm test
```

---

## 📖 Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [Angular CLI Reference](https://angular.dev/tools/cli)
