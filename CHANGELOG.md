# bedrock-vc-exchanger ChangeLog

## 4.0.0 -

### Added
- **BREAKING**: Add json schema validators for `/exchanges/:exchangeId`.
- **BREAKING**: Add json schema validators for `/exchanges/:exchangeId/:transactionId`.

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
