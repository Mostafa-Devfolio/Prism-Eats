# PRISM Eats - Food Ordering Platform

A full-stack food ordering web application built as a technical prototype. The platform supports a complete customer journey from browsing the menu to tracking order status, alongside a secure admin dashboard for managing products and monitoring incoming orders.

This project was developed with a strong focus on performance, avoiding unnecessary re-renders, and implementing a clean architecture using Next.js App Router.

## Features

- **Dynamic Menu:** Paginated/Lazy-loaded product grid with images and pricing.
- **Cart Management:** State managed via Redux Toolkit and synced with `localStorage` for data persistence.
- **Checkout & Payments:** Supports both Cash on Delivery (COD) and Online Payment options.
- **Order Tracking:** Interactive visual stepper for customers to track their order status (Pending, Preparing, Delivered).

- **Admin Dashboard:** - Protected route for users with `ADMIN` role.
  - Live statistics (Revenue, Total Orders, etc.).
  - Interactive UI to add/edit products and update order statuses.
- **Authentication:** Secure credential-based login and registration using Next-Auth.
- **Localization (i18n):** Full support for English (LTR) and Arabic (RTL) using `next-intl`.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **State Management:** Redux Toolkit
- **Database & ORM:** PostgreSQL / Prisma
- **Authentication:** Next-Auth
- **Form Handling & Validation:** React Hook Form + Zod
- **Internationalization:** Next-intl

## Architectural Highlights

- **Zero Unnecessary Re-renders:** Heavy use of `React.memo`, `useMemo`, and atomic client components (e.g., in the Cart Drawer and Product Cards) to ensure adding an item to the cart doesn't trigger a global layout re-render.
- **Server Actions:** All data mutations (Add/Edit products, update orders) are handled securely via Next.js Server Actions.
- **Hydration Safe:** Custom hooks and logic implemented to safely read from `localStorage` without causing SSR hydration mismatches.

## Quick Access
- **Live Demo:** [https://electropi.devfolio.net](https://electropi.devfolio.net)
- **Admin Credentials:**
  - **Email:** admin@electro.pi
  - **Password:** ElectroPi

**The application is fully deployed and ready for review. If you prefer to run it locally, please follow the "Getting Started" section below.**

## Getting Started

### 1. Clone the repository
```bash
git clone [https://github.com/Mostafa-Devfolio/Prism-Eats.git](https://github.com/Mostafa-Devfolio/Prism-Eats.git)

cd prism-eats

2. Install dependencies
npm install

3. Environment Variables
Create a .env file in the root directory and add the following variables. (Replace the database URL with your own Postgres connection string):

DATABASE_URL="postgresql://user:password@localhost:5432/prism_db?schema=public"
NEXTAUTH_SECRET="generate_a_random_secret_string_here"
NEXTAUTH_URL="http://localhost:3000"

4. Database Setup
Run Prisma migrations to generate the schema:
npx prisma generate
npx prisma db push
npx prisma db seed

5. Run the Application
npm run dev
Open http://localhost:3000 in your browser.

- Admin Access
To review the Admin Dashboard, you can log in using the following seeded admin credentials:

Email: admin@electro.pi
Password: ElectroPi

Alternatively, register a new account and manually update the user role to ADMIN in the database.

- Author
Mostafa Sherif

LinkedIn: https://linkedin.com/in/mostafa-sheriif

GitHub: https://github.com/Mostafa-Devfolio