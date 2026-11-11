# Backend Architecture

## Migration overview

The original backend was a single TypeScript Express file with in-memory listing fixtures and three GET routes. It has been migrated into a NestJS application using Nest's Express adapter. The browser-only registration, search, landlord, and tenant workflows remain in the frontend and are not represented as secure backend functionality.

## Runtime modules

```text
backend/src/
  main.ts
  app.module.ts
  auth/
  config/
  common/filters/
  database/
  health/
  listings/
  payments/
  verification/
```

- `main.ts` configures the API prefix, JSON body-size limits, CORS allowlist, global validation, consistent exception formatting, and development Swagger.
- `ConfigModule` validates required environment values during startup.
- `DatabaseModule` provides a shared Prisma client.
- `AuthModule` provides database-backed opaque sessions, password hashing, and server-derived role context. It never trusts a role or user ID from a request body.
- `HealthModule` reports application state and checks PostgreSQL connectivity.
- `ListingsModule` delegates listing retrieval to a service. Its explicitly named demo provider retains the legacy fixture response without inserting fixtures into PostgreSQL.
- `PaymentsFoundationModule` provides payment object-access policy, payment-state transition checks, and append-only financial audit writes. It does not expose payment APIs or contact a provider yet.
- `VerificationModule` reports the existing demo counters and makes it explicit that production verification decisions are not implemented.

## Persistence

Prisma stores users and multiple role assignments, revocable sessions, landlord/property relationships, and property-level agent authorizations. Rental transactions, itemized obligations, submission/evidence metadata, invoices, provider attempts, webhook idempotency records, and financial audit events are defined for the payment foundation. NGN amounts use `BigInt` minor units (kobo), and financial relations use restrictive deletes.

The audit log is append-only at both service and database-trigger levels. Uploaded evidence storage is not implemented; `PaymentEvidence` stores metadata and a private storage key only.

## Compatibility choices

- The existing `GET /api/listings` array item fields and demo records are retained.
- The original `GET /api/verification-status` fields remain, with additive fields identifying the demo source and unimplemented production decisions.
- `GET /api/health` retains `status`, `service`, and `timestamp`, and adds a `database.status` field. A database outage reports `degraded` rather than preventing the process from starting.
- The frontend currently reads property fixtures from its own TypeScript module and has no API fetch calls. Its UI and browser-only flows remain unchanged by the backend migration.

## Security boundaries

- CORS allows only configured frontend origins; requests without an `Origin` header remain usable for local CLI health checks.
- Global validation transforms inputs, strips no unknown fields silently, and rejects non-whitelisted fields.
- JSON request bodies are limited to 100 KB.
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, and `GET /api/auth/me` provide a backend identity foundation. Sessions use random opaque tokens in `HttpOnly`, `SameSite=Lax` cookies; only a SHA-256 token hash is stored. The `Secure` cookie flag is enabled in production. Public registration cannot assign the `ADMIN` role.
- State-changing requests with an `Origin` header are checked against the configured frontend allowlist. Credentialed CORS is enabled for configured origins.
- The frontend still uses its explicitly demo-only localStorage profile flow; it is not connected to these endpoints and cannot authorize backend access.
- Email verification, password reset, login rate limiting, admin provisioning, production account operations, and a production identity provider are not implemented. Do not treat this foundation as launch-ready authentication.
- Payment schemas and policies are not yet exposed through APIs. There is no provider adapter, checkout, webhook handler, evidence upload service, or rental-payment workflow yet.
- Swagger is exposed only when `NODE_ENV` is not `production`.
- Do not use the frontend demo storage or sample listings as real user, property, availability, or verification records.
