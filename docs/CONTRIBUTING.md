# Contributing to Legitblock Web Platform

Thank you for your interest in contributing to the **Legitblock Web Platform & Documentation Hub**!

We welcome contributions from legal technologists, cryptographic engineers, frontend developers, and documentation authors. This guide explains how to set up your local development environment, adhere to project conventions, and submit high-quality contributions.

---

## 🏗️ Code of Conduct

We are dedicated to providing a welcoming, constructive, and inclusive environment. Please treat all contributors with respect, professionalism, and collegiality.

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS versions)
- **pnpm**: `v9.x` or `v12.x` (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Git**: Configured with your SSH or GPG signing keys

### Local Setup
1. Fork and clone the repository:
   ```bash
   git clone git@github.com:<your-username>/legitblock.github.io.git
   cd legitblock.github.io
   ```
2. Ensure you are on the `master` branch:
   ```bash
   git checkout master
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3001](http://localhost:3001) to view the application with hot module reloading.

---

## 📐 Architecture & Coding Conventions

### 1. Framework & Routing
- Built on **Next.js 14 App Router** (`src/app/`).
- Because this site is deployed to **GitHub Pages**, all pages must be statically exportable (`output: 'export'` in `next.config.mjs`).
- Never use dynamic server-only Next.js features (`headers()`, `cookies()`, SSR dynamic route segments without `generateStaticParams()`).
- Components with state, hooks, or browser API access (such as `crypto.subtle` or `navigator.credentials`) must declare the `'use client'` directive at the top of the file.

### 2. TypeScript Guidelines
- Strict type checking is enforced (`tsconfig.json`).
- Avoid using `any`. Define clear interfaces or types for all component props, contractual clauses, Merkle tree nodes, and statutory parameters.
- Verify type correctness before opening a PR:
  ```bash
  pnpm typecheck
  ```

### 3. Styling & UI Components
- Use **Tailwind CSS** for layout, spacing, and styling.
- Ensure all interactive widgets support dark mode and custom theme tokens defined in `src/app/globals.css`.
- Use **Lucide React** (`lucide-react`) for consistent icons.
- Ensure accessibility: provide semantic HTML, descriptive labels, and keyboard-navigable elements.

### 4. Cryptographic Primitives
- Rely on native Web APIs:
  - W3C Web Cryptography API (`window.crypto.subtle`) for SHA-256 and HMAC operations.
  - W3C Web Authentication API (`navigator.credentials`) for hardware passkey signing.
- Always implement graceful fallbacks for environments where hardware or secure context flags are restricted.
- **Never** send plaintext contracts, secret seeds, or private keys over external network calls.

---

## 🌿 Git & Branching Strategy

- The primary development and production branch is **`master`**.
- Create feature branches originating from `master`:
  - `feat/feature-name` for new interactive tools or UI enhancements.
  - `fix/bug-description` for bug fixes.
  - `docs/topic-name` for documentation additions or legal statute revisions.
  - `refactor/scope` for internal code refactoring.

### Commit Messages
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```
Examples:
- `feat(playground): add interactive Merkle proof verifier`
- `fix(pdf-gen): correct xref byte offset calculation for ISO compliance`
- `docs(jurisdictions): update eIDAS 2.0 electronic ledger reference`
- `chore(ci): add automated typecheck and static build verification`

---

## ✅ Pull Request Checklist

Before submitting a Pull Request, verify that your changes pass all local checks:

```bash
# 1. Typecheck the entire TypeScript codebase
pnpm typecheck

# 2. Compile the static Next.js export build
pnpm build
```

Ensure that:
- [ ] `pnpm typecheck` exits with zero errors.
- [ ] `pnpm build` completes successfully and exports all static routes to `./out/`.
- [ ] No extraneous build artifacts, `.next` caches, or sensitive files are staged.
- [ ] Documentation is updated if you added or changed user-facing features.
- [ ] Your branch is rebased on the latest `origin/master`.

---

## 🚀 Continuous Integration (CI)

Every pull request triggers the automated GitHub Actions CI pipeline (`.github/workflows/ci.yml`), which validates:
1. Strict TypeScript type compliance (`pnpm typecheck`).
2. Production static export generation (`pnpm build`).
3. Output artifact directory integrity (`./out`).

Once approved and merged into `master`, the continuous deployment workflow (`.github/workflows/deploy.yml`) automatically builds and publishes the updated site to GitHub Pages.
