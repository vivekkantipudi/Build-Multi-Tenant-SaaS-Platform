# Multi-Tenant SaaS Platform

A production-ready, containerized Multi-Tenant SaaS application for project and task management. It features strict data isolation, role-based access control (RBAC), and subscription management.

## Features
* **Multi-Tenancy:** Data isolation using a Shared Database, Shared Schema approach with `tenant_id` filtering.
* **Authentication:** Secure JWT-based auth with role management (Super Admin, Tenant Admin, User).
* **RBAC:** Granular permissions for different user roles.
* **Project Management:** Create, update, and manage projects isolated to your organization.
* **Task Tracking:** Assign tasks, set priorities, and track status.
* **Dockerized:** Fully containerized setup (Frontend, Backend, Database) with one-command deployment.
* **Auto-Seeding:** Database automatically populates with test data on startup.

## Tech Stack
* **Frontend:** React.js, Docker
* **Backend:** Node.js, Express, PostgreSQL (pg)
* **Database:** PostgreSQL 15
* **DevOps:** Docker, Docker Compose

## Installation & Setup

### Prerequisites
* Docker & Docker Compose installed on your machine.
* Git

### Steps to Run
1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-folder>
    ```

2.  **Start the Application:**
    Run the following command in the root directory. This handles building, database creation, migration, and seeding automatically.
    ```bash
    docker-compose up -d --build
    ```

3.  **Verify Status:**
    Ensure all containers are up and healthy:
    ```bash
    docker-compose ps
    ```

4.  **Access the App:**
    * **Frontend:** [http://localhost:3000](http://localhost:3000)
    * **Backend Health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

## Default Credentials (Seed Data)
The system comes pre-loaded with a demo tenant.

| Role | Email | Password | Subdomain |
| :--- | :--- | :--- | :--- |
| **Tenant Admin** | `admin@demo.com` | `Demo@123` | `demo` |
| **User** | `user1@demo.com` | `User@123` | `demo` |
| **Super Admin** | `superadmin@system.com` | `Admin@123` | (Leave Empty) |


## Documentation
* [Research & Analysis](docs/research.md)
* [Product Requirements (PRD)](docs/PRD.md)
* [System Architecture](docs/architecture.md)
* [Technical Specification](docs/technical-spec.md)
* [API Documentation](docs/API.md)
