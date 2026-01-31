# Complete API Documentation (19 Endpoints)

## Authentication (4)
1. `POST /api/auth/register-tenant` - Register a new organization
2. `POST /api/auth/login` - Login and receive JWT
3. `POST /api/auth/logout` - Invalidate token
4. `GET /api/auth/me` - Get current user profile

## Tenants (5)
5. `GET /api/tenants` - List all tenants (Super Admin)
6. `GET /api/tenants/:tenantId` - Get tenant details
7. `PUT /api/tenants/:tenantId` - Update tenant settings
8. `DELETE /api/tenants/:tenantId` - Delete tenant
9. `GET /api/tenants/:tenantId/users` - List users for a tenant

## Users (4)
10. `POST /api/tenants/:tenantId/users` - Create new user
11. `GET /api/users/:userId` - Get user details
12. `PUT /api/users/:userId` - Update user
13. `DELETE /api/users/:userId` - Delete user

## Projects (4)
14. `POST /api/projects` - Create project
15. `GET /api/projects` - List projects
16. `PUT /api/projects/:projectId` - Update project
17. `DELETE /api/projects/:projectId` - Delete project

## Tasks (3)
18. `POST /api/projects/:projectId/tasks` - Create task
19. `GET /api/projects/:projectId/tasks` - List tasks
20. `PATCH /api/tasks/:taskId/status` - Update task status

## System (1)
21. `GET /api/health` - System health check