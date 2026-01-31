# Technical Specification

## Project Structure
The project follows a containerized microservices pattern.

```text
/
├── backend/
│   ├── migrations/       # SQL Schema (Moved here for Docker compatibility)
│   │   └── schema.sql
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth & Error handling
│   │   ├── routes/       # API Route definitions
│   │   ├── utils/        # Seeder & Helpers
│   │   └── app.js        # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/              # React components
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── docs/                 # Project Documentation
├── docker-compose.yml    # Service Orchestration
└── submission.json       # Test credentials