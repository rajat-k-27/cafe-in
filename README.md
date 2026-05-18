# Cafe Menu Manager

Cafe Menu Manager is a full-stack CRUD application built for cafe operations. It lets admins manage menu items, stock, pricing, GST, and images, while customers can browse the menu publicly and place orders after logging in.

This project is intentionally focused and production-minded, with validation, authorization, media uploads, and stock-aware ordering.

## Problem and Solution

**Problem:** Cafes struggle to keep menu updates, stock, and orders aligned across staff and customers, especially during rush hours.

**Solution:** A single, fast dashboard that keeps menu data clean, prevents out-of-stock orders, and supports a clean ordering flow for customers.

## Key Features

- Public menu browsing with INR pricing and GST
- Admin-only menu management (create, update, delete)
- Stock-aware ordering (no orders when out of stock)
- Image uploads to Cloudinary for menu items
- User sign-up/login to place orders
- Role-based authorization and secure sessions

## User Roles

- **Admin:** Adds and updates menu items, sets stock and availability
- **User:** Browses menu, logs in, and places orders

## CRUD Scope

- **Menu Items (Admin):** Create, Read, Update, Delete
- **Orders (User/Admin):** Create and Read

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- MongoDB
- Cloudinary

## Security and Validation

- JWT-based session cookies with `httpOnly` and `sameSite`
- Zod validation on all inputs
- Role-based access control (admin vs user)
- Stock validation and atomic stock decrement to prevent over-ordering

## Performance and Optimization

- App Router with server rendering for data-heavy views
- Minimal client state and focused UI rendering
- Cloudinary for optimized image delivery

## Real-World Considerations

- Prevents ordering of unavailable items
- Clear role separation for admin actions
- Sanitized inputs and consistent error responses
- Scalable data model for menu and order growth

## Routes and Pages

- `/` Home
- `/menu-items` Menu listing
- `/menu-items/new` Admin create
- `/menu-items/[id]/edit` Admin edit
- `/login` User login
- `/register` User registration
- `/admin/login` Admin login
- `/orders` User order history
- `/orders/new` Place order
- `/admin/orders` Admin view of all orders

## API Endpoints

- `GET /api/menu-items`
- `POST /api/menu-items` (admin)
- `GET /api/menu-items/[id]`
- `PUT /api/menu-items/[id]` (admin)
- `DELETE /api/menu-items/[id]` (admin)
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/orders` (user)
- `POST /api/orders` (user)
- `POST /api/uploads/sign` (admin)

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env.local
```

3. Update `.env.local` with your MongoDB and Cloudinary credentials.

4. Set `AUTH_SECRET` to a long random string.

5. Start the dev server:

```bash
npm run dev
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `MONGODB_DB`: Optional database name (defaults to `cafe_menu_manager`)
- `AUTH_SECRET`: Random secret for signing sessions
- `ADMIN_EMAIL`: Initial admin email
- `ADMIN_PASSWORD`: Initial admin password
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## Admin Access

The first admin account is seeded from `ADMIN_EMAIL` and `ADMIN_PASSWORD` on the first admin login attempt.

## Deployment

- Recommended: Vercel
- Set all environment variables in the hosting dashboard
- Build command: `npm run build`
- Start command: `npm run start`

## CI/CD (Suggested)

- GitHub Actions workflow for build and lint on pull requests
- Automatic deploys on main branch via Vercel

## Testing (Suggested)

- API integration tests for menu and orders
- E2E tests for login and order placement

## AI Add-ons (Optional)

- Menu description enhancer
- Demand prediction for stock

## Footer Profiles

The app footer includes name, GitHub, and LinkedIn as required by the assignment.
