# Product Requirements Document (PRD)

## User Personas
1.  **Super Admin:** System owner. Can manage all tenants and subscription plans.
2.  **Tenant Admin:** Manager of a specific organization. Can add users and projects within their organization.
3.  **Standard User:** Employee. Can view projects and manage tasks assigned to them.

## Functional Requirements
1.  System shall allow new organizations to register with a unique subdomain.
2.  System shall support login via email, password, and tenant subdomain.
3.  System shall enforce a "Free" plan limit (max 5 users).
4.  Tenant Admins shall be able to invite new users.
5.  Tenant Admins shall be able to create new projects.
6.  Users shall be able to view projects assigned to their tenant.
7.  System shall isolate project data so Tenant A cannot see Tenant B's projects.
8.  Users shall be able to create tasks within a project.
9.  Users shall be able to update task status (Todo -> In Progress -> Done).
10. Users shall be able to delete tasks they created.
11. System shall log critical actions (like user creation) for audit purposes.
12. Super Admin shall be able to view a list of all registered tenants.
13. System shall return standard HTTP error codes (401, 403, 404).
14. System shall require JWT authentication for all protected routes.
15. Passwords must be hashed before storage.

## Non-Functional Requirements
1.  **Security:** All API requests must be validated via JWT.
2.  **Performance:** API response time should be under 200ms for standard requests.
3.  **Availability:** The system should be deployable via Docker for high availability.
4.  **Scalability:** Database schema is designed to support 10,000+ tenants.
5.  **Usability:** Frontend must be responsive (mobile-friendly).