# DwellSafe Backend

NestJS + TypeScript backend using the Express adapter, PostgreSQL, and Prisma.

The current API consists of `GET /api/health`, `GET /api/listings`, and `GET /api/verification-status`. Listings and verification counts are explicitly identified demo fixtures; no demo data is inserted into PostgreSQL.

See [Backend Setup](../docs/implementation/BACKEND_SETUP.md), [Backend Architecture](../docs/implementation/BACKEND_ARCHITECTURE.md), [Database Schema](../docs/implementation/DATABASE_SCHEMA.md), and [API Specification](../docs/implementation/API_SPECIFICATION.md) for configuration, migrations, route contracts, and security limitations.
