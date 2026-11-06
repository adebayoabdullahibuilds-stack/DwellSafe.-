# Contributing to DwellSafe

Thank you for helping build a safer housing marketplace experience for Nigeria.

## Development workflow

1. Read the relevant product, technical, design, and implementation documentation in `docs/`.
2. Create a focused branch for your change.
3. Keep backend, frontend, and documentation changes explicitly separated unless the work is tightly coupled.
4. Validate the affected workspace with the appropriate build or test command.
5. Document behavior changes, especially if they affect verification, authorization, or user trust workflows.

## Commit guidance

Use clear, meaningful commits such as:

- `feat: add property verification workflow`
- `fix: prevent unauthorized listing updates`
- `docs: update marketplace trust requirements`

## Security

Do not commit secrets, credentials, tokens, or production configuration. Use `.env` locally and keep `.env.example` as the template.
