# Technical Requirements

## Architecture

DwellSafe follows a separated frontend/backend architecture with a clear API boundary and a persisting data layer.

## Stack choices

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Data layer: relational or document-based persistence per implementation decision

## Functional domains

- identity and user accounts
- property records and canonical ownership
- agents and authorization relationships
- listings and lifecycles
- verification records and state transitions
- notifications and marketplace activity

## Security

All user-facing APIs should validate input and enforce authorization rules before mutating marketplace state.
