# Implementation Guide

## Current foundation

- Responsive React marketplace and fictional property discovery UI.
- Browser-only tenant and landlord demo profiles, apartment records, and tenant-request workflows; these are not secure authentication or production persistence.
- NestJS backend replacing the original single-file Express API, with compatible health, demo listing, and verification-status endpoints.
- PostgreSQL/Prisma schema and initial migration for property listings and verification decisions; no fictional seed data.
- CORS allowlist, environment validation, API input validation, consistent errors, and development Swagger.
- Jest unit tests and backend setup/API/database documentation.

Production authentication, server-backed marketplace workflows, verification review, and persistent account/occupancy models remain future milestones.

## Documentation

- [Project status](./PROJECT-STATUS.md)
- [Backend architecture](./BACKEND_ARCHITECTURE.md)
- [Database schema](./DATABASE_SCHEMA.md)
- [API specification](./API_SPECIFICATION.md)
- [Backend setup](./BACKEND_SETUP.md)

## Validation

Run the project build to confirm both frontend and backend compile cleanly before merging changes.
