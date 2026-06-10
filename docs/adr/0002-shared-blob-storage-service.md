# Blob storage uploads go through a shared BlobStorageService

Vercel Blob upload/delete logic for file attachments and backups was
duplicated across backend modules. As Candidate 4 of the architecture review,
this was extracted into a shared `BlobStorageService` (`src/common/blob-storage/`),
with `BlobStorageModule` imported by the modules that need it (e.g.
`releases`).

Any backend module that needs to read, write, or delete files in Vercel Blob
storage should import `BlobStorageModule` and use `BlobStorageService` rather
than calling the Vercel Blob SDK directly. New blob-storage behavior (retry
logic, path conventions, content-type handling) belongs in
`BlobStorageService` only, so all callers stay consistent.
