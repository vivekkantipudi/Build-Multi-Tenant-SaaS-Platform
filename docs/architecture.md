# System Architecture

## Overview
The application follows a standard 3-tier architecture:
1.  **Presentation Layer:** React Frontend (Single Page Application).
2.  **Application Layer:** Node.js/Express REST API.
3.  **Data Layer:** PostgreSQL Database.

*(Place System Architecture Diagram Here - save as docs/images/system-architecture.png)*

## Database Schema (ERD)
The database consists of the following core tables:
* `tenants` (id, name, subdomain, plan)
* `users` (id, tenant_id, email, password, role)
* `projects` (id, tenant_id, name, status)
* `tasks` (id, tenant_id, project_id, title, status)
* `audit_logs` (id, tenant_id, user_id, action, timestamp)

*(Place ER Diagram Here - save as docs/images/database-erd.png)*

## API Endpoint Overview
* **Auth:** `/api/auth/login`, `/api/auth/register-tenant`
* **Tenants:** `/api/tenants`
* **Projects:** `/api/projects`
* **Tasks:** `/api/projects/:projectId/tasks`
* **Users:** `/api/tenants/:tenantId/users`