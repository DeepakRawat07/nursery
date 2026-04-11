# UTTARAKHANDSUCCULENT

Full-stack nursery e-commerce application built with Angular 19, Tailwind CSS, Node.js, Express, and PostgreSQL.

## Stack

- Frontend: Angular 19 standalone components, Tailwind CSS, reactive forms, interceptors, guards
- Backend: Node.js, Express, MVC structure, JWT auth, RBAC, multer uploads
- Database: PostgreSQL with normalized relations, foreign keys, and indexes
- Extras: Wishlist, admin analytics, toast notifications, loading overlay, image preview

## Folder Structure

```text
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── utils
│   │   └── validators
│   └── uploads
├── database
│   ├── schema.sql
│   └── seed.sql
├── docs
│   └── api.md
└── frontend
    └── src
        ├── app
        │   ├── core
        │   ├── features
        │   └── shared
        ├── assets
        └── environments
```

## Setup

1. Start PostgreSQL locally, or use Docker:

   ```bash
   docker compose up -d postgres
   ```

2. Create backend environment config:

   ```bash
   cp backend/.env.example backend/.env
   ```

3. Apply schema and seed data:

   ```bash
   psql -U postgres -d nursery_store -f database/schema.sql
   psql -U postgres -d nursery_store -f database/seed.sql
   ```

4. Install dependencies:

   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   ```

5. Run the backend:

   ```bash
   npm run dev:backend
   ```

6. Run the frontend in a second terminal:

   ```bash
   npm run dev:frontend
   ```

7. Open `http://localhost:4200`.
API-backed features still require the backend running on `http://localhost:4000`.

## Environment Variables

Backend variables are in `backend/.env.example`.

Frontend API targets are currently defined in:

- `frontend/src/environments/environment.ts`
- `frontend/src/environments/environment.development.ts`

## Email OTP Setup

Registration can work in two modes:

- Production email mode: OTP is sent to the user's email inbox.
- Local testing mode: OTP is shown in the app when SMTP is not configured.

For real OTP emails, set either `SMTP_SERVICE` for a known provider or `SMTP_HOST` for a custom SMTP server, then restart the backend.

Gmail example:

```env
SMTP_SERVICE=Gmail
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-google-app-password
SMTP_FROM=Nursery Store <your-email@gmail.com>
```

Outlook / Microsoft 365 example:

```env
SMTP_SERVICE=Outlook365
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password-or-app-password
SMTP_FROM=Nursery Store <your-email@outlook.com>
```

Custom SMTP example, such as Hostinger or cPanel mail:

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=store@example.com
SMTP_PASS=your-smtp-password
SMTP_FROM=Nursery Store <store@example.com>
```

If you leave SMTP empty in development, the register page will display the OTP directly for local testing.

## Seed Data

`database/seed.sql` includes:

- 2 users
- 8 plants across Indoor, Outdoor, and Medicinal categories
- sample cart items
- sample wishlist items
- 1 delivered order with order items

## Main Features

- Public plant browsing with search, filters, and pagination
- JWT login and registration
- Cart, checkout, order history, wishlist
- Admin analytics dashboard
- Plant CRUD with image URL or file upload
- Order status management
- User list view

## API Examples

See `docs/api.md` for endpoint summaries and cURL examples.
