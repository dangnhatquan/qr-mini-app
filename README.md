# QR Mini App

## Development

### Using Zalo Mini App Extension

1. Install [Visual Studio Code](https://code.visualstudio.com/download) and [Zalo Mini App Extension](https://mini.zalo.me/docs/dev-tools).
1. In the **Home** tab, process **Config App ID** and **Install Dependencies**.
1. Navigate to the **Run** tab, select the suitable launcher, and click **Start**.

### Using Zalo Mini App CLI

1. Bootstrap.
1. [Install Zalo Mini App CLI](https://mini.zalo.me/docs/dev-tools/cli/intro/).

   ```bash
   npm install -g zmp-cli
   ```

1. **Install dependencies**:
   ```bash
   make bootstrap
   ```
1. **Start** the dev server:
   ```bash
   make dev
   ```
1. **Open** `localhost:3000` in your browser.

## Deployment

1. **Create** a mini program. For instructions on how to create a mini program, please refer to the [Coffee Shop Tutorial](https://mini.zalo.me/tutorial/coffee-shop/step-1/)

1. **Deploy** your mini program to Zalo using the mini app ID created.
   - **Using Zalo Mini App Extension**: navigate to the **Deploy** panel > **Login** > **Deploy**.
   - **Using Zalo Mini App CLI**:
     ```bash
     zmp login
     zmp deploy
     ```

1. Open the mini app in Zalo by scanning the QR code.

## Resources

- [Zalo Mini App Official Website](https://mini.zalo.me/)
- [ZaUI Documentation](https://mini.zalo.me/documents/zaui/)
- [ZMP SDK Documentation](https://mini.zalo.me/documents/api/)
- [DevTools Documentation](https://mini.zalo.me/docs/dev-tools/)
- [Ready-made Mini App Templates](https://mini.zalo.me/zaui-templates)
- [Community Support](https://mini.zalo.me/community)

---

## Git Branching Model

### Main branches

| Branch | Purpose | Merged from |
|---|---|---|
| `staging` | Stable branch, requires code review before merging | Merged from `dev` after testing |
| `dev` | Integration branch for deploying to the test environment | Merged from `feature/*`, `fix/*` |

### Supporting branches

| Branch | Naming convention | Example | Branch from | Merge into |
|---|---|---|---|---|
| Feature | `feature/<feature-name>` | `feature/qr-editor-konva` | `staging` | `staging` |
| Fix | `fix/<issue-name>` | `fix/slug-collision-retry` | `staging` | `staging` |
| Release | `release/v<major>.<minor>.<patch>` | `release/v0.3.0` | `staging` | `release` → `staging` |

### Release convention

During development, use **semver** starting at `v0.x.y`:

```
v0.1.0  — first milestone (auth + QR CRUD complete)
v0.2.0  — new features added (editor, landing pages)
v0.2.1  — minor hotfix on staging
v1.0.0  — production-ready, acceptance criteria passed
```

Versioning rules:
- `patch` (`v0.x.Y`) — bug fixes, no new features
- `minor` (`v0.X.0`) — new features, backward compatible
- `major` (`vX.0.0`) — breaking changes or production release

---

## Git Commit Convention

Follows [Conventional Commits](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13).

### Format

```
<type>(<optional scope>): <description>

<optional body>

<optional footer>
```

### Types

| Type | When to use |
|---|---|
| `feat` | Add or change a feature in the API or UI |
| `fix` | Fix a bug introduced by a previous `feat` |
| `refactor` | Rewrite or restructure code without changing behavior |
| `perf` | A refactor that specifically improves performance |
| `style` | Code formatting, whitespace — no behavior change |
| `test` | Add or correct tests |
| `docs` | Documentation changes only |
| `build` | Build tools, dependencies, project version |
| `ops` | Infrastructure, CI/CD, deployment scripts |
| `chore` | Everything else (init, `.gitignore`, ...) |

### Description rules

- Use **imperative, present tense**: `add` not `added` or `adds`
- **Do not** capitalize the first letter
- **Do not** end with a period (`.`)

### Breaking changes

Add `!` before `:` and describe in the footer:

```
feat(auth)!: remove zalo token exchange endpoint

BREAKING CHANGE: clients must now use POST /auth/zalo with body { accessToken }
```