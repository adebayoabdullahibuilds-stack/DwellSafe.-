# Database Schema

## Initial scope

PostgreSQL is accessed through Prisma. The initial schema includes only the entities needed to establish future listing and verification persistence:

### `PropertyListing`

- UUID primary key.
- Required title and location.
- Annual rent as `DECIMAL(14,2)`.
- Bedroom and bathroom counts.
- Availability flag.
- Creation and update timestamps.
- Index on `(isAvailable, location)` for common discovery filters.
- Optional one-to-one relationship with `Verification`.

### `Verification`

- UUID primary key and unique UUID `listingId`.
- Decision enum: `PENDING`, `IN_REVIEW`, `VERIFIED`, or `REJECTED`.
- Optional notes and creation/update timestamps.
- Foreign key to `PropertyListing`, cascading on deletion.
- Index on `(decision, updatedAt)`.

The first migration is `backend/prisma/migrations/20261106230000_initial_listing_verification/migration.sql`. No sample or fictional listings are inserted into the database. Existing API fixtures are provided separately by the backend's explicit demo-data provider.

## Deferred entities

The schema does not yet create users, tenant/landlord/agent profiles, property management assignments, tenant requests, occupancy, verification documents, or notifications. Their relationships, ownership rules, lifecycle, and access controls must be designed before adding migrations.

## Local database

`docker-compose.yml` runs PostgreSQL with a named volume and a readiness health check. Set local development values in `.env` using `.env.example` as a template. The example credentials are for local development only and must never be reused in production.

Apply migrations with `npm run db:migrate`. This creates or updates the local schema and records migration state in Prisma's `_prisma_migrations` table. Do not edit an applied migration; create a new migration for later schema changes.
