# DwellSafe Frontend

This frontend provides a responsive marketplace interface for property discovery and verification.

## Routes

- `/` — homepage with a search form, popular locations, featured sample homes, and an explanation of verification.
- `/properties` — searchable and filterable sample listings. Search values are read from URL query parameters such as `location`, `type`, `minRent`, and `maxRent`.
- `/properties/:id` — details for a sample property.
- `/register` — choose a tenant or landlord account type.
- `/register/tenant`, `/register/landlord`, and `/register/agent` — role-specific demo registration forms.
- `/login` and `/forgot-password` — authentication UI states.
- `/tenant/dashboard` — current demo apartment and tenant request status.
- `/landlord/dashboard` — demo apartment portfolio, occupants, incoming tenant requests, and apartment creation.
- `/agent/dashboard` — agent dashboard placeholder.

The listings in `src/data/listings.ts` are fictional demonstration data. They are labelled as demo listings and pending verification; none are represented as genuinely verified or available properties.

## Demo account and data status

The tenant and landlord flows are browser-only prototypes. Demo account profiles, landlord-created apartments, tenant requests, and assignments are stored in the current browser's `localStorage`; they are not sent to the backend or shared across devices. Registration does not store passwords. Demo sign-in selects a saved profile by email and does not authenticate or verify identity. Clearing this site's browser storage removes demo data. Do not enter real personal or property information.

Landlords can add demo apartments and accept or decline tenant requests. Accepting a request assigns the tenant as the apartment's occupant. The listings page can filter sample and landlord-created demo apartments by category, location, and rent. These actions are not suitable for real-world use.

Before enabling production account and property flows, configure a trusted server-side identity provider or implement equivalent backend services for:

- account registration with role assigned and persisted by the server;
- sign-in and sign-out using secure, `HttpOnly`, `Secure`, `SameSite` session cookies;
- server-derived roles and authorization checks for each dashboard/API request;
- password-reset tokens with expiry, rate limits, and a real email delivery service;
- consent and published privacy/terms policies.

The existing backend does not provide authentication, apartment-management, or tenant-request endpoints. A production implementation should use server-side storage and authorization for accounts, listings, apartment occupancy, and request decisions. Dashboard authorization must be enforced on the server for protected data and actions. Password-reset must only report success after the configured mail provider accepts the request. Keep provider secrets and signing keys on the server; never expose them through `VITE_*` variables.

Do not treat a client-selected role or registration as verification. Do not request identity or property evidence until secure storage, access controls, retention rules, and the review workflow are implemented.

## Run locally

```bash
npm install
npm run dev
```
