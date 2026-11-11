# Database Schema

## Existing marketplace models

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

## Phase 1 payment foundation

The additive migration `20261111230500_payment_foundation` introduces:

- `User`, `UserRoleAssignment`, and `Session` for persisted identity, multiple roles, and revocable opaque sessions. A role is assigned separately from a user; public registration cannot grant `ADMIN`.
- Optional `PropertyListing.landlordId` and `PropertyAgentAuthorization` for persisted landlord ownership and explicitly authorized agent relationships.
- `RentalTransaction` with tenant, landlord, property, optional primary agent, transaction status, currency, and terms snapshot.
- `PaymentObligation` with itemized purpose, integer `amountMinor` (kobo), currency, intended beneficiary, a reference to securely stored payment instructions, payment route, separate obligation and settlement states.
- `PaymentSubmission` and `PaymentEvidence` metadata. Evidence bytes must live in private storage; upload and retrieval services are not implemented in this phase.
- `Invoice`, `PaymentAttempt`, and uniquely keyed `WebhookEvent` records to support future DwellSafe-only provider checkout.
- `FinancialAuditLog`, append-only by database trigger. Financial foreign keys restrict deletion to preserve history.

Positive-value database constraints prevent zero/negative kobo amounts and zero-byte evidence metadata. Evidence and submission claim details cannot be updated/deleted; the submission's review status remains mutable and must be audited by the application. State-transition policy rejects invalid terminal transitions and requires a reason when rejecting a submission.

These models are foundations only: no payment API, provider, settlement, issue workflow, or evidence storage has been implemented.

## Local database

`docker-compose.yml` runs PostgreSQL with a named volume and a readiness health check. Set local development values in `.env` using `.env.example` as a template. The example credentials are for local development only and must never be reused in production.

Apply migrations with `npm run db:migrate`. This creates or updates the local schema and records migration state in Prisma's `_prisma_migrations` table. Do not edit an applied migration; create a new migration for later schema changes.
