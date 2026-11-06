# Backend Architecture

## Migration overview

The original backend was a single TypeScript Express file with in-memory listing fixtures and three GET routes. It has been migrated into a NestJS application using Nest's Express adapter. The browser-only registration, search, landlord, and tenant workflows remain in the frontend and are not represented as secure backend functionality.

## Runtime modules

```text
backend/src/
  main.ts
  app.module.ts
  config/
  common/filters/
  database/
  health/
  listings/
  verification/
```

- `main.ts` configures the API prefix, JSON body-size limits, CORS allowlist, global validation, consistent exception formatting, and development Swagger.
- `ConfigModule` validates required environment values during startup.
- `DatabaseModule` provides a shared Prisma client.
- `HealthModule` reports application state and checks PostgreSQL connectivity.
- `ListingsModule` delegates listing retrieval to a service. Its explicitly named demo provider retains the legacy fixture response without inserting fixtures into PostgreSQL.
- `VerificationModule` reports the existing demo counters and makes it explicit that production verification decisions are not implemented.

## Persistence

Prisma models only the initial listing and verification foundation. A `Verification` belongs to one `PropertyListing`; the unique listing relation enforces at most one current verification record per listing. UUIDs, timestamps, enum decision states, foreign-key cascading, and query indexes are defined in the schema and initial migration.

Future account, tenant, landlord, agent, assignment, occupancy, request, document, and notification entities are intentionally deferred until their business relationships and authorization rules are designed.

## Compatibility choices

- The existing `GET /api/listings` array item fields and demo records are retained.
- The original `GET /api/verification-status` fields remain, with additive fields identifying the demo source and unimplemented production decisions.
- `GET /api/health` retains `status`, `service`, and `timestamp`, and adds a `database.status` field. A database outage reports `degraded` rather than preventing the process from starting.
- The frontend currently reads property fixtures from its own TypeScript module and has no API fetch calls. Its UI and browser-only flows remain unchanged by the backend migration.

## Security boundaries

- CORS allows only configured frontend origins; requests without an `Origin` header remain usable for local CLI health checks.
- Global validation transforms inputs, strips no unknown fields silently, and rejects non-whitelisted fields.
- JSON request bodies are limited to 100 KB.
- There are no authentication or authorization endpoints. Client-selected roles, local-storage state, and user IDs are not trusted credentials.
- Swagger is exposed only when `NODE_ENV` is not `production`.
- Do not use the frontend demo storage or sample listings as real user, property, availability, or verification records.
