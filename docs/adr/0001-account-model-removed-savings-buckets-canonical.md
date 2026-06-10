# Account/accountId model is fully removed; savings buckets are canonical

The `Account`/`accountId` model (schemas, modules, services, controllers, and
all references in the NestJS API) was already superseded by the named-savings-
buckets model from an earlier migration (see
`memory/project_savings_migration.md` in the frontend repo), but dead code
referencing the old model remained in the backend.

As Candidate 1 of the architecture review, this dead code was removed
entirely from the backend (the frontend's Flutter side of this same cleanup is
tracked separately in the frontend repo's ADRs). The `savings` module is the
only model for tracking savings going forward — new savings-related endpoints
should extend the buckets model and must not reintroduce `Account`/`accountId`
schemas, DTOs, or routes.
