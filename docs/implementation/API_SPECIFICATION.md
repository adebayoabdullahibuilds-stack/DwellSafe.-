# API Specification

Base path: `/api`. Interactive Swagger documentation is available at `/api/docs` outside production.

## `GET /api/health`

Checks the application and attempts a lightweight PostgreSQL query.

Example:

```json
{
  "status": "ok",
  "service": "dwellsafe-backend",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "database": { "status": "connected" }
}
```

When PostgreSQL is unavailable, the endpoint responds with HTTP 200 and `"status": "degraded"` plus `"database": { "status": "disconnected" }`. It remains useful for distinguishing a running API from its database dependency.

## `GET /api/listings`

Returns an array with the legacy response shape. The current provider returns fictional demonstration records only; it does not query or seed the database.

```json
[
  {
    "id": "LS-1001",
    "title": "2-bedroom apartment in Lekki Phase 1",
    "location": "Lekki Phase 1, Lagos",
    "price": "N8,500,000 / year",
    "status": "Demo listing — not verified",
    "landlord": "Adebisi O.",
    "agent": "BrightHomes Realty",
    "bedrooms": 2,
    "bathrooms": 2,
    "available": true
  }
]
```

The API fixtures are not real listings, offers, availability assertions, or verified property records.

## `GET /api/verification-status`

Preserves the original counters and adds explicit demo/production distinctions.

```json
{
  "totalListings": 3,
  "verified": 0,
  "pending": 0,
  "demo": 3,
  "note": "All API listings are fictional demonstration data and have not been verified.",
  "lastUpdated": "2026-01-01T00:00:00.000Z",
  "dataSource": "demo-provider",
  "productionVerification": {
    "status": "not_implemented",
    "note": "No production verification decisions are available from this endpoint."
  }
}
```

These are demo fixture counts, not counts of persisted or verified properties.

## Errors

Unhandled API exceptions use the consistent JSON response:

```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "Internal server error",
  "path": "/api/example",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

Expected Nest HTTP errors retain their status and validation messages. No API in this milestone accepts a request body or implements registration/authentication.
