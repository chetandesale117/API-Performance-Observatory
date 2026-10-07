# API-Performance-Observatory

# Walkthrough — API Performance Observatory (Phase 1 Complete)

Phase 1 of the **API Performance Observatory** application has been completely built in `D:\new projects 2026\api-performance-check`.

---

## 🏗️ What Was Built

### 1. Spring Boot 3.3.5 Backend (`backend/`)
- **Maven & Dependencies**: Spring Web, Security (JWT), Data JPA, Validation, WebSocket, Redis, RabbitMQ, Actuator, Flyway, PostgreSQL, Prometheus Micrometer, SpringDoc OpenAPI 2.6.0.
- **Custom JWT Auth System**: `JwtService` using JJWT `0.12.6`, stateless security filter chain, BCrypt (strength 12), token refresh & revocation flow.
- **Database Migrations (Flyway)**:
  - `V1__init_users_and_auth.sql`: Users and Refresh Tokens.
  - `V2__create_projects_collections.sql`: Projects, Collections, and Folders.
  - `V3__create_api_requests.sql`: API Requests, Headers, Parameters, and Execution History.
- **Project & Collection Hierarchy**: Multi-tenant workspace endpoints for managing projects, nested folders, and request trees.
- **Postman-Grade HTTP Request Execution**: Integrated Java 11+ `HttpClient` service measuring response latency down to the millisecond, capturing status codes, response payload byte size, response headers, and persisting execution history.

### 2. React 19 + TypeScript Frontend (`frontend/`)
- **Vite 6 + Tailwind CSS v4 Setup**: Direct `@tailwindcss/vite` integration with custom OKLCH dark theme tokens, glassmorphism card styling, and animated radar sweep branding.
- **Component UI Kit (shadcn/ui style)**: Custom implementations of `Button`, `Card`, `Input`, `Dialog`, `DropdownMenu`, `Select`, `Tabs`, `Badge`, `Separator`, `Tooltip`, `Skeleton`, `ScrollArea`, `Avatar`, `Label`, `Switch`, `Popover`, `Collapsible`, `Checkbox`, `Sonner`.
- **Postman-Grade API Client (`ApiClientPage`)**:
  - **RequestBuilder**: Color-coded HTTP method selector (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`), URL bar, Send & Save actions.
  - **Monaco Editor Integration**: Embedded `@monaco-editor/react` in dark mode for editing JSON payloads and inspecting formatted response bodies.
  - **Key-Value Editors**: Dynamic tables for query parameters, custom HTTP request headers, and authentication configuration (`Bearer`, `Basic`, `API Key`).
  - **ResponseViewer**: Latency stat counters, status badges (`200 OK`, `404 Not Found`, etc.), payload size, response headers inspector.
  - **CollectionSidebar**: Tree view of collections, nested folders, and requests with active request highlighting.
- **Observatory Telemetry Dashboard (`DashboardPage`)**: Interactive Recharts visualizations:
  - **Latency & Percentiles**: P50, P95, and P99 latency lines.
  - **Throughput (RPS)**: Area chart with gradient fills.
  - **HTTP Error Rate**: Color-coded bar chart.
  - **Infrastructure Health**: CPU and Memory utilization area chart.
  - **KPI Metric Cards**: Real-time trend badges (+/- percentage indicators).

### 3. Container & Kubernetes Infrastructure
- **`docker-compose.yml`**: Full multi-container stack (TimescaleDB/PostgreSQL 16, Redis 7, RabbitMQ 3.13 with management UI, Prometheus, Backend, Frontend).
- **`docker-compose.dev.yml`**: Infrastructure-only composition for local dev server iteration.
- **`prometheus/prometheus.yml`**: Configured scraper fetching Spring Boot Actuator `/actuator/prometheus` metrics every 5 seconds.
- **Kubernetes Manifests (`k8s/`)**: Production-ready deployment configs:
  - `00-namespace.yaml`
  - `01-configmaps-secrets.yaml`
  - `02-postgres.yaml` (StatefulSet)
  - `03-redis.yaml`
  - `04-rabbitmq.yaml`
  - `05-backend.yaml` (Deployment with health probes + HPA ready)
  - `06-frontend.yaml` (Nginx static bundle + SPA route fallback)
  - `07-ingress.yaml` (Nginx Ingress controller routes)

---

## 📁 File Structure Overview

```
D:\new projects 2026\api-performance-check\
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/
│       ├── java/com/observatory/api/
│       │   ├── ApiPerformanceObservatoryApplication.java
│       │   ├── shared/ (BaseEntity, ApiResponse, GlobalExceptionHandler, configs)
│       │   ├── auth/ (User, RefreshToken, JwtService, SecurityConfig, AuthController)
│       │   ├── project/ (Project, Collection, Folder entities, services, controllers)
│       │   └── apiclient/ (ApiRequest, execution service, Monaco DTOs, history)
│       └── resources/
│           ├── application.yml
│           ├── application-dev.yml
│           └── db/migration/ (V1__init_users_and_auth.sql, V2, V3)
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── components.json
│   ├── index.html
│   ├── nginx.conf
│   ├── Dockerfile
│   └── src/
│       ├── styles/index.css (Tailwind v4 OKLCH theme)
│       ├── lib/ (api-client, query-client, utils)
│       ├── stores/ (useAuthStore, useProjectStore, usePreferencesStore)
│       ├── types/ (api.types.ts)
│       ├── components/ (ui/, navigation/, feedback/, data-display/)
│       ├── features/
│       │   ├── auth/ (LoginPage)
│       │   ├── projects/ (ProjectsPage, ProjectDetailPage, ProjectCard)
│       │   ├── api-client/ (ApiClientPage, RequestBuilder, Monaco Editors)
│       │   ├── dashboard/ (DashboardPage with Recharts)
│       │   └── misc/ (ComingSoonPage, NotFoundPage)
│       ├── layouts/ (AuthLayout, DashboardLayout)
│       └── app/ (App, routes, providers)
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── prometheus/prometheus.yml
└── k8s/ (00-namespace to 07-ingress)
```

---

## 🚀 How to Run Locally

### Option A: Run Infrastructure via Docker Compose & Dev Servers
1. **Start Database & Services**:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```
2. **Start Spring Boot Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
3. **Start React Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Option B: Run Full Production Stack with Docker Compose
```bash
docker-compose up --build -d
```
Access Frontend at `http://localhost:3000`, Backend API at `http://localhost:8080`, and Prometheus at `http://localhost:9090`.
