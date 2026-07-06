# Food Company Website

A production-ready **Next.js 14** web application built with the **App Router**, **TypeScript**, **Tailwind CSS**, **ESLint**, and **Prettier**.

---

## Tech Stack

| Tool                                         | Version | Purpose                         |
| -------------------------------------------- | ------- | ------------------------------- |
| [Next.js](https://nextjs.org)                | 14      | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org) | 5+      | Static type safety              |
| [Tailwind CSS](https://tailwindcss.com)      | 3       | Utility-first styling           |
| [ESLint](https://eslint.org)                 | 8       | Code linting                    |
| [Prettier](https://prettier.io)              | 3       | Code formatting                 |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Lint your code
npm run lint

# Format your code
npm run format

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Folder Structure

```
food-company-website/
├── app/                        # Next.js App Router root
│   ├── (customer)/             # Customer route group
│   │   ├── layout.tsx          # Shared shell for all customer pages
│   │   └── page.tsx            # Home / landing page
│   ├── (admin)/                # Admin route group
│   │   ├── layout.tsx          # Shared shell for all admin pages
│   │   └── dashboard/
│   │       └── page.tsx        # Admin dashboard page
│   ├── api/                    # API Route Handlers
│   │   └── health/
│   │       └── route.ts        # GET /api/health – health check endpoint
│   ├── globals.css             # Global Tailwind CSS styles
│   ├── layout.tsx              # Root layout (applies to all routes)
│   └── page.tsx                # Default root page
├── components/                 # Shared, reusable UI components
│   └── index.ts                # Barrel export file
├── lib/                        # Utilities, helpers, and server-side logic
│   └── index.ts                # Barrel export file
├── public/                     # Static assets (images, fonts, icons)
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── .prettierignore             # Files ignored by Prettier
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and npm scripts
```

---

## Folder Purposes

### `app/`

The **App Router** root. Every `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `route.ts` file inside here becomes a route or UI boundary automatically.

### `app/(customer)/`

A **route group** for all customer-facing pages (home, menu, product detail, checkout, order tracking, etc.). The parentheses mean `(customer)` does **not** appear in the URL — `/` stays `/`, not `/customer/`. The group has its own `layout.tsx` for the shared customer shell (navbar, footer, etc.).

### `app/(admin)/`

A **route group** for all admin-only pages (dashboard, order management, user management, settings, etc.). Like the customer group, `(admin)` is invisible in the URL. The group layout is the ideal place to add authentication guards so unauthenticated users are redirected.

### `app/api/`

**Next.js Route Handlers** live here. Each subfolder with a `route.ts` file becomes an API endpoint. For example, `app/api/health/route.ts` → `GET /api/health`. Use these for server-side data mutations, webhooks, and third-party integrations.

### `components/`

**Shared, reusable UI components** — buttons, cards, modals, form inputs, skeletons, etc. Components here should be framework-agnostic and focused on presentation. Use the barrel file (`index.ts`) to re-export components cleanly.

### `lib/`

**Utility functions, API clients, constants, and server-side helpers.** Nothing UI-specific lives here. Good candidates: `formatDate()`, `cn()` (class merger), `fetcher()`, Prisma client instance, auth helpers, and environment variable validators.

### `public/`

**Static assets** served at the root URL. Anything placed here is accessible at `/filename` without any import. Use it for favicons, og-images, and static files.

---

## Code Quality

This project uses **ESLint + Prettier** together:

- ESLint enforces code correctness and Next.js best practices (`next/core-web-vitals`).
- Prettier handles all formatting. ESLint's formatting rules are disabled via `eslint-config-prettier` to prevent conflicts.
- `prettier/prettier` is set to `"warn"` so you see formatting suggestions in your editor without hard build failures.

---

## Environment Variables

Create a `.env.local` file in the project root for local secrets:

```bash
# .env.local (never commit this file)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=your_database_url_here
```

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. All others remain server-only.
