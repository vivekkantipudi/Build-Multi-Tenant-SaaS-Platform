# Research & System Design

## 1. Multi-Tenancy Analysis
For this SaaS platform, we evaluated three common multi-tenancy models:

1.  **Database per Tenant:** Strongest isolation but high infrastructure cost and complex maintenance.
2.  **Schema per Tenant:** Good balance, but migration management becomes difficult as tenant count grows.
3.  **Shared Database, Shared Schema (Selected):** * **Description:** All tenants share the same database and tables. A `tenant_id` column associates every row with a specific tenant.
    * **Justification:** This approach was chosen because it is the most cost-effective and scalable for a project management tool. It simplifies deployment (only one database to manage) and allows for easier cross-tenant analytics if needed.
    * **Security:** Isolation is enforced at the application layer via Middleware, ensuring no user can query data without a valid `tenant_id`.

## 2. Technology Stack
* **Backend (Node.js/Express):** Chosen for its non-blocking I/O, vast ecosystem, and ease of handling JSON APIs.
* **Database (PostgreSQL):** Selected for its robust support for relational data, ACID compliance, and performance with complex queries.
* **Frontend (React):** Provides a responsive, component-based UI that separates concerns effectively.
* **Containerization (Docker):** Ensures the application runs identically in development and production environments.

## 3. Security Considerations
* **Data Isolation:** Middleware automatically injects `tenant_id` into queries, preventing data leakage.
* **Authentication:** `bcrypt` is used for hashing passwords (10 rounds). JWTs are signed with a secret key and expire in 24 hours.
* **Input Validation:** All inputs are validated to prevent SQL injection and XSS attacks.