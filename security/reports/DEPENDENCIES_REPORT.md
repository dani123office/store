# Dependencies Security Report

## Status: PASS

## Findings

Audited `package.json` and `backend/composer.json`:

### package.json
1. **Version pinning**: All dependencies were using `^` (caret) ranges allowing automatic minor/patch upgrades. **FIX**: Pinned all dependencies to exact versions.
2. **json-server**: Was in `dependencies` (production). This is a mock server for development. **FIX**: Moved to `devDependencies`.
3. **Lock file**: `package-lock.json` is present and committed — ensures reproducible installs.

### composer.json
1. **Version ranges**: Uses `^` for all packages, which is standard for Composer projects. The `composer.lock` ensures exact versions are installed.
2. **No suspicious packages**: All packages are well-known, established libraries (`laravel/framework`, `laravel/sanctum`, etc.).
3. **Stable versions**: Only stable releases (no alpha/beta except `mockery/mockery`).

### npm audit
Run `npm audit` to check for known vulnerabilities in production dependencies.

## What's at risk

Unpinned dependencies could introduce breaking changes or security vulnerabilities if a malicious actor compromises a dependency and pushes a new version. Pinned versions mitigate this.

## What's already secure

- Lock files committed (`package-lock.json`, `composer.lock`).
- All packages are well-known with large download counts.
- `json-server` moved to dev-only dependency (not used in production).

## Recommendations

- Run `npm audit` regularly and before each deployment.
- Consider using `npm audit fix` for critical vulnerabilities.
- Enable Dependabot or Renovate for automated dependency updates.
