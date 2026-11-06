# DwellSafe Project Status

## Overview

DwellSafe is an early-stage housing marketplace prototype focused on helping people discover rental homes and understand property information. The current implementation is a working UI and browser-only demonstration, not a production marketplace.

## Implemented

### Public marketplace

- Responsive landing page with navigation, search entry points, featured homes, and product information.
- Fictional sample property listings and property detail pages.
- Property search with keyword, location, property category, yearly rent range, and sorting filters.
- Search filters are reflected in the URL so a filtered result can be bookmarked or shared.
- Listing information is clearly presented as sample/demo content and not verified.

### Registration and demo profiles

- Account type chooser for tenants and landlords.
- Separate registration pages for tenants, landlords, and agents.
- Shared authentication layout and password field component.
- Live password requirements and a strength indicator.
- Demo profile creation and email-based demo sign-in.
- Passwords are not stored. Demo sign-in does not verify a password or identity.

### Tenant and landlord workflows

- Landlord dashboard to add apartments, see their apartment portfolio and occupants, and review tenant requests.
- Tenant dashboard to view an assigned apartment and request statuses.
- Tenants can request landlord-created apartments from the property search results.
- Landlords can accept or decline requests. Accepting a request assigns the tenant as the apartment's occupant.
- Tenant search can filter both fictional sample listings and demo apartments by category, location, and rent.

### Backend

The NestJS backend currently provides:

- `GET /api/health`
- `GET /api/listings`
- `GET /api/verification-status`

The API listings are fictional demonstration data from a dedicated provider. The browser-only account, apartment, and tenant-request flows do not use the backend. PostgreSQL/Prisma is configured with initial listing and verification models; no demo fixtures are seeded into the database.

## Demo storage and safety limitations

Demo account profiles, landlord-created apartments, requests, and occupancy assignments are saved in the current browser's `localStorage`. They are not shared across browsers or devices, sent to the backend, or protected by server authentication. Clearing the browser's site data removes them.

Do not use the prototype for real accounts, personal information, property records, tenant screening, payments, or verification decisions. Demo listings and account states do not establish that a real home is available or verified.

## Not yet implemented

- Applying migrations against a running PostgreSQL instance remains environment-dependent.
- Production authentication, password verification, secure sessions, and role-based server authorization.
- Database persistence and APIs for accounts, apartments, occupancy, and tenant requests.
- A functional agent dashboard or agent-to-landlord/property workflows.
- Verification review, moderation, notifications, and password recovery email delivery.
- Production privacy and terms policies.

Before any real-world use, implement and test the backend services, persistent storage, server-enforced authorization, security controls, privacy practices, and operational workflows.

## Run and validate

From the repository root:

```bash
npm run dev
npm run build
```

The development command starts both workspaces. The frontend is served by Vite, and the backend runs on port `4000` by default. See [Backend Setup](./BACKEND_SETUP.md) for PostgreSQL, Prisma, test, and API commands.
