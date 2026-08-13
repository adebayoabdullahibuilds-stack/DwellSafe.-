DwellSafe

«A verified housing marketplace designed to make property discovery safer, more transparent, and more trustworthy.»

DwellSafe is a housing marketplace focused on reducing the uncertainty and risks associated with finding rental properties in Nigeria.

The platform connects property seekers with verified property listings while introducing a structured verification and trust layer for landlords, agents, properties, and listings.

Rather than attempting to eliminate legitimate property agents, DwellSafe provides a structured system in which landlords, primary agents, prospective tenants, and other authorized participants can interact around verified property information.

---

Table of Contents

- "Overview" (#overview)
- "Problem" (#problem)
- "Goals" (#goals)
- "Core Principles" (#core-principles)
- "Core Users" (#core-users)
- "Core Capabilities" (#core-capabilities)
- "System Architecture" (#system-architecture)
- "Repository Structure" (#repository-structure)
- "Technology Stack" (#technology-stack)
- "Documentation" (#documentation)
- "Development Setup" (#development-setup)
- "Environment Variables" (#environment-variables)
- "Development Workflow" (#development-workflow)
- "Security" (#security)
- "Testing" (#testing)
- "Git Workflow" (#git-workflow)
- "Project Status" (#project-status)
- "License" (#license)

---

Overview

Finding housing can be difficult because prospective tenants often have limited ability to determine:

- whether a property actually exists;
- whether the person listing it has legitimate authority;
- whether different listings represent the same property;
- whether a landlord has authorized an agent;
- whether property information is accurate;
- whether a listing is still available;
- whether the person requesting payment is trustworthy.

DwellSafe is designed around verification, transparency, and trust.

The platform provides a structured marketplace where property information can be submitted, verified, managed, discovered, and communicated through defined relationships between landlords, agents, and property seekers.

---

Problem

The housing market contains several sources of friction and risk, including:

- fraudulent or misleading property listings;
- impersonation;
- unverified landlords and agents;
- duplicate or conflicting property listings;
- lack of transparency around agent relationships;
- difficulty confirming property ownership or authorization;
- unnecessary dependence on informal communication;
- rent and property information changing without adequate transparency;
- difficulty determining whether a listing is still available.

DwellSafe aims to address these problems by introducing a verification-first marketplace model.

---

Goals

DwellSafe aims to:

1. Make property discovery safer.
2. Increase trust between property seekers, landlords, and agents.
3. Provide verified property and listing information.
4. Establish clear relationships between landlords and authorized agents.
5. Reduce fraudulent and misleading listings.
6. Reduce unnecessary friction in property discovery.
7. Provide a canonical source of truth for verified listings.
8. Improve transparency throughout the property discovery process.
9. Provide a foundation that can support housing-market workflows across Nigerian states.

---

Core Principles

Verification First

Important marketplace entities should have an appropriate verification state.

Trust Through Transparency

Users should understand why a property, landlord, agent, or listing has a particular trust status.

Clear Ownership and Authorization

The system should distinguish between:

- property ownership;
- landlord accounts;
- primary agents;
- other agents;
- property listings.

Canonical Property Records

A verified property should have a canonical representation rather than allowing uncontrolled duplicate representations.

Human-Centered UX

The platform should minimize unnecessary complexity and make important actions understandable.

Security by Design

Authentication, authorization, sensitive information, verification data, and marketplace actions should be protected from the beginning.

Separation of Concerns

Frontend, backend, documentation, infrastructure, and configuration concerns should remain clearly separated.

---

Core Users

Property Seekers

Users looking for available properties.

They should be able to:

- discover properties;
- search and filter listings;
- inspect property information;
- understand verification status;
- save relevant properties;
- contact the appropriate party;
- make informed decisions based on available information.

Landlords

Property owners or authorized property owners who can:

- establish their identity;
- register properties;
- manage property information;
- authorize agents;
- review property-related activity;
- manage listings associated with their properties.

Primary Agents

Agents formally associated with a landlord/property.

A primary agent acts as the principal agent relationship for a property where such an arrangement exists.

Other Agents

Other legitimate agents may interact with the marketplace through the defined agent workflow rather than bypassing the established primary-agent relationship.

Platform Administrators

Administrators oversee:

- verification workflows;
- reports;
- disputes;
- users;
- properties;
- listings;
- platform integrity;
- moderation and operational processes.

---

Core Capabilities

The platform is expected to provide capabilities around:

Authentication and Accounts

- account creation;
- authentication;
- authorization;
- profile management;
- role-based access.

User Verification

Support for appropriate verification workflows for marketplace participants.

Property Management

- property registration;
- property information management;
- property status;
- ownership/authorization relationships;
- verification state.

Agent Management

- landlord-agent relationships;
- primary agent designation;
- agent authorization;
- agent notifications;
- agent-related property workflows.

Listing Management

- listing creation;
- listing verification;
- listing publication;
- listing status;
- availability;
- listing management.

Property Discovery

- search;
- filtering;
- sorting;
- property details;
- verification indicators;
- location-based discovery.

Communication

Support for communication workflows between appropriate marketplace participants.

Notifications

Users should receive relevant notifications for important events such as:

- verification requests;
- property changes;
- agent authorization;
- listing activity;
- marketplace interactions.

Trust and Verification

The verification system should communicate meaningful trust information without misleading users into assuming that verification guarantees every aspect of a transaction.

---

System Architecture

DwellSafe follows a separated frontend/backend architecture.

                    ┌───────────────────────┐
                    │       DwellSafe       │
                    │   Housing Marketplace │
                    └───────────┬───────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        ┌───────▼────────┐              ┌───────▼────────┐
        │    Frontend    │              │     Backend    │
        │                │              │                │
        │ React + TS     │              │ API + Business │
        │ UI/UX          │              │ Logic          │
        │ State          │              │ Auth           │
        │ API Client     │              │ Verification   │
        │ PWA            │              │ Marketplace    │
        └───────┬────────┘              └───────┬────────┘
                │                               │
                └───────────────┬───────────────┘
                                │
                       ┌────────▼────────┐
                       │    Database     │
                       │ / External APIs │
                       └─────────────────┘

The frontend is responsible for presentation and client-side interaction.

The backend is responsible for:

- business rules;
- authentication;
- authorization;
- verification workflows;
- marketplace logic;
- data validation;
- persistence;
- APIs;
- security-sensitive operations.

---

Repository Structure

dwellsafe/
│
├── backend/
│   ├── ...
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   └── brand/
│   ├── src/
│   └── README.md
│
├── docs/
│   ├── prd/
│   ├── trd/
│   ├── design/
│   └── implementation/
│
├── .editorconfig
├── .env.example
├── .gitattributes
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── SECURITY.md

Documentation Rule

Project documentation belongs inside "docs/".

docs/
├── prd/
├── trd/
├── design/
└── implementation/

The documentation should be treated as the authoritative source for product, technical, design, and implementation decisions.

---

Technology Stack

The exact versions and dependencies should follow the authoritative TRD.

Frontend

The frontend is structured as a modern web application with:

- React
- TypeScript
- Vite
- responsive/mobile-first UI
- Progressive Web App capabilities

Backend

The backend is responsible for the marketplace API and business logic.

The technology choices should follow the approved TRD rather than introducing unrelated frameworks during implementation.

Data Layer

The data layer should provide reliable persistence for:

- users;
- properties;
- listings;
- agents;
- landlord relationships;
- verification records;
- notifications;
- marketplace activity.

---

Documentation

The project documentation is organized into four major areas.

Product Requirements

docs/prd/

Contains product requirements, goals, users, features, workflows, and business requirements.

Technical Requirements

docs/trd/

Contains:

- architecture;
- technology decisions;
- backend requirements;
- frontend requirements;
- API requirements;
- data requirements;
- security requirements;
- infrastructure requirements;
- technical constraints.

Design

docs/design/

Contains:

- UI/UX specifications;
- design system;
- design principles;
- typography;
- colors;
- spacing;
- grids;
- layouts;
- motion;
- icons;
- illustrations;
- UX laws;
- design tokens;
- brand assets and references.

Implementation

docs/implementation/

Contains implementation specifications and execution guidance for turning the approved product, technical, and design requirements into working software.

---

Development Setup

Prerequisites

Install the development tools required by the frontend and backend sections of the TRD.

You should also have:

- Git;
- a code editor;
- the required runtime/toolchain versions;
- the required database;
- required backend services.

Clone the Repository

git clone <repository-url>
cd dwellsafe

Frontend

cd frontend
npm install
npm run dev

Backend

From a separate terminal:

cd backend

Follow the backend setup instructions defined by the backend implementation documentation.

---

Environment Variables

Environment variables must never contain production secrets in committed source code.

Use:

.env

for local secrets and:

.env.example

for documenting required variables.

Never commit:

- API keys;
- passwords;
- database credentials;
- JWT secrets;
- private keys;
- cloud credentials;
- production tokens.

---

Development Workflow

Before implementing a feature:

1. Read the relevant PRD requirements.
2. Read the relevant TRD requirements.
3. Read the relevant design specification.
4. Read the relevant implementation specification.
5. Identify affected frontend/backend modules.
6. Implement the smallest coherent change.
7. Run validation and tests.
8. Review security implications.
9. Update documentation when required.

The project should not introduce architectural changes that contradict the TRD without updating the authoritative documentation first.

---

Testing

Testing should cover the appropriate layers of the system.

Frontend

Test:

- components;
- user interactions;
- forms;
- navigation;
- important workflows;
- responsive behavior where appropriate.

Backend

Test:

- business logic;
- API endpoints;
- authentication;
- authorization;
- verification workflows;
- data validation;
- important marketplace workflows.

Integration

Important cross-system workflows should be tested to ensure the frontend and backend operate correctly together.

---

Security

Security is a core requirement of DwellSafe because the platform handles identity, property information, marketplace relationships, and potentially sensitive user data.

Security considerations include:

- secure authentication;
- authorization;
- input validation;
- API protection;
- secure session/token handling;
- protection of sensitive data;
- rate limiting where appropriate;
- secure file handling;
- auditability of important actions;
- prevention of unauthorized property/listing changes.

See "SECURITY.md" for project security expectations.

---

Git Workflow

The repository should use meaningful commits.

Examples:

feat: add property verification workflow
feat: implement property search
fix: prevent unauthorized listing updates
docs: update property verification requirements
refactor: simplify listing service
test: add property authorization tests

Avoid committing generated files, secrets, local environment files, dependency directories, or build artifacts.

---

Project Status

DwellSafe is being developed as a greenfield verified housing marketplace.

The project is currently in active development.

Product, technical, design, and implementation decisions should be reflected in the corresponding documentation under "docs/".

---

License

See "LICENSE" for licensing information.
