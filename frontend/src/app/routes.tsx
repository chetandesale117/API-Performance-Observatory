import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { ProjectsPage } from '../features/projects/pages/ProjectsPage';
import { ProjectDetailPage } from '../features/projects/pages/ProjectDetailPage';
import { ApiClientPage } from '../features/api-client/pages/ApiClientPage';
import { ComingSoonPage } from '../features/misc/pages/ComingSoonPage';
import { NotFoundPage } from '../features/misc/pages/NotFoundPage';
import {
  FileJson,
  Gauge,
  Activity,
  History,
  GitCompare,
  Server,
  Database,
  Cpu,
  Container,
  MessageSquare,
  Bell,
  FileBarChart,
  Settings,
} from 'lucide-react';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
    ],
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:id', element: <ProjectDetailPage /> },
      { path: 'api-client', element: <ApiClientPage /> },

      {
        path: 'swagger-import',
        element: (
          <ComingSoonPage
            title="OpenAPI / Swagger Import Engine"
            description="Import OpenAPI 3.0/3.1 specs, Swagger 2.0 files, and Postman v2.1 collections with automatic endpoint parsing and variable mapping."
            icon={FileJson}
          />
        ),
      },
      {
        path: 'performance-tests',
        element: (
          <ComingSoonPage
            title="k6 Distributed Load Testing Engine"
            description="Configure virtual users, ramp-up schedules, thresholds, and execute distributed k6 performance tests directly from your observatory."
            icon={Gauge}
          />
        ),
      },
      {
        path: 'live-monitor',
        element: (
          <ComingSoonPage
            title="Real-Time Streaming Telemetry"
            description="WebSocket-powered live request tracing, error rate anomaly detection, and sub-millisecond latency histograms."
            icon={Activity}
          />
        ),
      },
      {
        path: 'test-history',
        element: (
          <ComingSoonPage
            title="Historical Test Run Archive"
            description="Search, filter, and inspect past performance test runs, assertion logs, and raw k6 result JSON artifacts."
            icon={History}
          />
        ),
      },
      {
        path: 'test-comparison',
        element: (
          <ComingSoonPage
            title="Side-by-Side Test Run Comparison"
            description="Compare baseline vs regression load test runs to detect performance degradation, memory leaks, and throughput drop-offs."
            icon={GitCompare}
          />
        ),
      },
      {
        path: 'service-monitoring',
        element: (
          <ComingSoonPage
            title="Backend Microservice Monitoring"
            description="Track HTTP error rates, Spring Boot actuator health metrics, circuit breaker states, and service dependency maps."
            icon={Server}
          />
        ),
      },
      {
        path: 'database-monitoring',
        element: (
          <ComingSoonPage
            title="PostgreSQL & TimescaleDB Observatory"
            description="Monitor connection pools (HikariCP), query execution times, buffer cache hit ratios, and slow query logs."
            icon={Database}
          />
        ),
      },
      {
        path: 'jvm-monitoring',
        element: (
          <ComingSoonPage
            title="JVM & Garbage Collection Metrics"
            description="Inspect G1/ZGC pause times, heap memory generation usage, thread counts, and virtual thread pin events."
            icon={Cpu}
          />
        ),
      },
      {
        path: 'kubernetes-monitoring',
        element: (
          <ComingSoonPage
            title="Kubernetes Cluster & Pod Telemetry"
            description="Monitor pod restart loops, container memory limits, HPA scaling events, and node CPU pressure."
            icon={Container}
          />
        ),
      },
      {
        path: 'rabbitmq-monitoring',
        element: (
          <ComingSoonPage
            title="RabbitMQ Queue Observatory"
            description="Track message publish rates, unacknowledged queue depths, consumer lag, and dead letter queue alerts."
            icon={MessageSquare}
          />
        ),
      },
      {
        path: 'alerts',
        element: (
          <ComingSoonPage
            title="Alert Engine & Webhooks"
            description="Set up SLA threshold breach alerts, Slack notifications, email summaries, and automated webhooks."
            icon={Bell}
          />
        ),
      },
      {
        path: 'reports',
        element: (
          <ComingSoonPage
            title="Automated PDF & HTML Performance Reports"
            description="Generate executive performance summaries, SLA compliance certificates, and detailed bottleneck reports."
            icon={FileBarChart}
          />
        ),
      },
      {
        path: 'settings',
        element: (
          <ComingSoonPage
            title="Observatory Workspace Settings"
            description="Manage API keys, environment variables, user role permissions, and retention policies."
            icon={Settings}
          />
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
