# bedrock-vc-exchanger ChangeLog

## 5.0.0 - 2025-03-27

### Changed
- **BREAKING**: Require Node.js >=20.
- Update dependencies.
  - `@digitalbazaar/ed25519-signature-2020@5.4.0`.
  - `@digitalbazaar/ezcap@4.1.0`.
  - `rfdc@1.4.1`.
- Update peer dependencies.
  - `@bedrock/core@6.3.0`.
  - `@bedrock/express@8.3.1`.
  - `@bedrock/https-agent@4.1.0`.
  - **BREAKING**: `@bedrock/mongodb@11`.
    - Use MongoDB driver 6.x and update error names and details.
    - See changelog for details.
- Update dev dependencies.
- Update test dependencies.

### Fixed
- Return passed `record` instead of resulting record from mongodb calls to
  enable using newer mongodb driver.
- Do not pass `writeOptions` in database calls.
- Remove unused `background` option from mongodb index creation.
- Pass `includeResultMetadata: true` to `findOneAndUpdate` to ensure meta data
  is always returned.

## 4.1.0 - 2023-10-12

### Changed
- Use `@digitalbazaar/ed25519-signature-2020@5.2.0`. This version provides
  better safe mode protections when canonizing.
- Use `@digitalbazaar/ezcap@4`. This version provides
  better safe mode protections when canonizing.

## 4.0.0 - 2023-01-23

### Changed
- **BREAKING**: Update peer deps:
  - `@bedrock/core@6.0.1`
  - `@bedrock/app-identity@4`
  - `@bedrock/express@8.1`
  - `@bedrock/mongodb@10.1`.

## 3.2.0 - 2022-08-12

### Changed
- Replace internal dependencies to remove esm.js-based CJS=>ESM transpilation.

## 3.1.0 - 2022-05-05

### Changed
- Removed unused dependencies.

## 3.0.0 - 2022-04-29

### Changed
- **BREAKING**: Update peer deps:
  - `@bedrock/core@6`
  - `@bedrock/app-identity@3`
  - `@bedrock/express@8`
  - `@bedrock/https-agent@4`
  - `@bedrock/mongodb@10`.

## 2.0.0 - 2022-04-06

### Changed
- **BREAKING**: Rename package to `@bedrock/vc-exchanger`.
- **BREAKING**: Convert to module (ESM).
- **BREAKING**: Remove default export.
- **BREAKING**: Require node 14.x.

## 1.1.0 - 2022-03-10

### Removed
- Remove (non-breaking) unnecessary peer deps:
  - `bedrock-credentials-context`
  - `bedrock-did-context`
  - `bedrock-did-io`
  - `bedrock-jsonld-document-loader`
  - `bedrock-security-context`
  - `bedrock-veres-one-context`
  - `bedrock-validation`.

## 1.0.1 - 2022-02-24

### Fixed
- Enable preflight cors on POST/PUT routes.

## 1.0.0 - 2022-02-24

- See git history for changes.
