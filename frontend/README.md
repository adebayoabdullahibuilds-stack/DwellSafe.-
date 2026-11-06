# DwellSafe Frontend

This frontend provides a responsive marketplace interface for property discovery and verification.

## Routes

- `/` — homepage with a search form, popular locations, featured sample homes, and an explanation of verification.
- `/properties` — searchable and filterable sample listings. Search values are read from URL query parameters such as `location`, `type`, `minRent`, and `maxRent`.
- `/properties/:id` — details for a sample property.
- `/register/landlord` and `/register/agent` — role-specific onboarding forms.
- `/login` and `/forgot-password` — authentication UI states.
- `/landlord/dashboard` and `/agent/dashboard` — protected placeholders; access is denied until server authentication and role checks exist.

The listings in `src/data/listings.ts` are fictional demonstration data. They are labelled as demo listings and pending verification; none are represented as genuinely verified or available properties.

## Authentication status

There is currently no authentication provider, account database, session service, registration API, or password-recovery integration in this repository. The account forms validate user input in the browser but intentionally do not submit or store it. They show a setup message instead of simulating account creation, sign-in, or email delivery.

Before enabling these flows, configure a trusted server-side identity provider or implement equivalent backend services for:

- account registration with role assigned and persisted by the server;
- sign-in and sign-out using secure, `HttpOnly`, `Secure`, `SameSite` session cookies;
- server-derived roles and authorization checks for each dashboard/API request;
- password-reset tokens with expiry, rate limits, and a real email delivery service;
- consent and published privacy/terms policies.

The existing backend does not provide these authentication endpoints. To connect a future implementation, configure `VITE_API_URL` to the public HTTPS API base and provide server-side implementations for role-specific registration, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/session`, and `POST /api/auth/password-reset`. The session endpoint must return the account's server-assigned role; dashboard authorization must also be enforced on the server for protected data and actions. Password-reset must only report success after the configured mail provider accepts the request. Keep provider secrets and signing keys on the server; never expose them through `VITE_*` variables.

Do not treat a client-selected role or registration as verification. Do not request identity or property evidence until secure storage, access controls, retention rules, and the review workflow are implemented.

## Run locally

```bash
npm install
npm run dev
```
