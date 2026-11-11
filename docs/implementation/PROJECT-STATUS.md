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

- Landlord dashboard to add apartments, assign verified demo agents, see occupants, review tenant requests, and review agent onboarding.
- Tenant dashboard to view an assigned apartment, request statuses, and the landlord-agent-tenant connection chain.
- Tenants can request landlord-created apartments from the property search results.
- Landlords can accept or decline requests. Accepting a request assigns the tenant as the apartment's occupant.
- Tenant search can filter both fictional sample listings and demo apartments by category, location, and rent.
- Agents can self-onboard or request a named landlord's relationship verification, view assigned properties and tenant connections, and receive ratings from tenants with accepted requests.
- Tenants, landlords, and agents share a demo identity-verification flow for NIN, voter-card, or driver's-license document categories. It records only the category and a pending status; it does not transmit or store selected files or collect ID numbers.

### Backend

The NestJS backend currently provides:

- `GET /api/health`
- `GET /api/listings`
- `GET /api/verification-status`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

The API listings are fictional demonstration data from a dedicated provider. The browser-only account, apartment, and tenant-request flows do not use the backend. PostgreSQL/Prisma is configured with initial listing and verification models; no demo fixtures are seeded into the database.

The Phase 1 payment foundation adds persisted users/roles/sessions, landlord and agent relationship models, rental transaction and payment records, invoice/provider event models, kobo-based amounts, payment state rules, object-access policy, and append-only audit writes. These records are not yet exposed through payment APIs and do not process or hold funds.

## Demo storage and safety limitations

Demo account profiles, landlord-created apartments, agent assignments, requests, ratings, onboarding decisions, and identity document categories are saved in the current browser's `localStorage`. They are not shared across browsers or devices, sent to the backend, or protected by server authentication. The identity document picker is a UI simulation: selected files stay in the browser and are discarded without upload or persistence. Clearing the browser's site data removes demo data.

Do not use the prototype for real accounts, personal information, property records, tenant screening, payments, or verification decisions. Demo listings and account states do not establish that a real home is available or verified.

## Not yet implemented

- Applying migrations against a running PostgreSQL instance remains environment-dependent.
- Email verification, password reset, login rate limiting, administrator provisioning, and production account operations.
- Database persistence and APIs for accounts, apartments, occupancy, and tenant requests.
- Production identity document upload/storage, verification review, moderation, notifications, and password recovery email delivery.
- Server-persisted agent-to-landlord/property workflows, enforceable agent ratings, and account authorization.
- Payment transaction APIs/UI, private evidence storage, payment review/issue workflows, platform invoice management, provider adapter, checkout, webhook verification, and reconciliation.
- Production privacy and terms policies.

The authentication foundation is not production-ready without email verification, rate limiting, account operations, and end-to-end security review. Before real-world use, implement and test the remaining backend services, evidence storage, payment workflows, provider approval, privacy practices, and operational controls.

## Run and validate

From the repository root:

```bash
npm run dev
npm run build
```

The development command starts both workspaces. The frontend is served by Vite, and the backend runs on port `4000` by default. See [Backend Setup](./BACKEND_SETUP.md) for PostgreSQL, Prisma, test, and API commands.
