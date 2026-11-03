# The Fast Dine

A responsive Nairobi delivery storefront inspired by the browsing and checkout flow in the supplied Glovo references, using the supplied The Fast Dine logo. It includes category browsing, store menus, a basket, an order summary, Supabase phone or email sign-in, account settings, order history, and a support centre.

The site is deployed to Vercel at [https://fast-dine.vercel.app](https://fast-dine.vercel.app). The Vercel rewrite configuration serves the client app for nested routes such as login and password recovery.

Login is split into separate routes: `/en/login`, `/en/login/signup`, `/en/login/verify`, and `/en/login/recovery`. Customers can create an account with an email and password, verify their email with a six-digit Supabase OTP, log in with the password, and request a password-reset link. OTP is used only to confirm new accounts, not to sign in; Supabase Auth manages the session.

The English entry page is `/en`. It introduces the available services, highlights Nairobi places, and links into the Nairobi storefront. The address form saves the delivery address locally before opening the store pages.

## Run locally

1. Install Node.js if it is not already installed.
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local URL Vite prints.

The basket, profile settings, and payment-method preview remain in this browser's local storage. Signed-in customers' order history is read from Supabase, and checkout saves orders there through a database function that recalculates catalog prices and fees. `FAST10` is validated and redeemed by that function. Saving an order does not process a payment, contact a courier, or send a support request; the app never asks for a full card number, CVV, wallet PIN, or payment OTP.

## Supabase PostgreSQL

The Fast Dine Supabase project is `skizdbibzzuypcvypjxq` in the Mumbai region (`ap-south-1`). Open it in the [Supabase dashboard](https://supabase.com/dashboard/project/skizdbibzzuypcvypjxq). Its API URL is `https://skizdbibzzuypcvypjxq.supabase.co`.

The initial schema is in [`supabase/schema.sql`](supabase/schema.sql), and the Nairobi catalog seed is in [`supabase/seed.sql`](supabase/seed.sql). The database has tables for categories, stores, products, profiles, delivery addresses, payment-method metadata, orders, order items, promo codes, and promo redemptions. The initial seed has 14 stores and 45 products; [`supabase/checkout_catalog.sql`](supabase/checkout_catalog.sql) synchronizes the 16 active storefronts and 211 products used by the app.

Row-level security is enabled on every public table. The catalog and currently active promo codes are readable without an account. Customers can manage only their own profile, addresses, and payment-method metadata; their orders are read-only to the browser. The `public.create_order` function in [`supabase/checkout.sql`](supabase/checkout.sql) creates an order and its lines atomically, using the signed-in customer ID and database catalog prices and fees. Run the initial schema and seed first, then `checkout_catalog.sql`, then `checkout.sql` in the Supabase SQL Editor. Payment records are limited to display metadata and provider references; never store full card numbers, CVV, mobile-money PINs, or one-time passwords.

The project's built-in Supabase Auth remains available, and a first sign-in creates a row in `public.profiles` under the authenticated customer's ID. The project URL and publishable key are in the ignored local `.env.local`; use [`.env.example`](.env.example) as the template on another machine. The browser uses only publishable keys; never put a service-role or secret key in browser code.

The Vercel function at `/api/order-events` accepts only authenticated Supabase Database Webhook `INSERT` and `UPDATE` events for `public.orders`. Configure the production `SUPABASE_WEBHOOK_SECRET` environment variable and add the same value as the `x-fast-dine-webhook-secret` header on the Supabase webhook. The endpoint logs only the order ID and status; it does not process payments or arrange fulfillment.

Password reset links return to `/en/login/recovery` on the current site origin. Add each deployed site origin (and local development origin when needed) to **Authentication → URL Configuration → Redirect URLs** in Supabase; otherwise Supabase will reject or redirect the reset link to the configured site URL.

The project uses Supabase Auth for sign-in. Clerk authentication has been removed from the local app and disconnected from Supabase Third-Party Auth.

The Supabase project uses text profile and order ownership IDs, and owner-only RLS policies compare them to the verified JWT `sub` claim. Existing UUID-based Supabase Auth customer IDs remain valid as text. The fresh database definition in [`supabase/schema.sql`](supabase/schema.sql) matches this setup.

For email/password registration with verification codes, email sign-in and email confirmations are enabled in Supabase **Authentication → Providers → Email**. The **Confirm sign up** template uses `{{ .Token }}` in the message body so Supabase sends a six-digit code; the app verifies it with the signup OTP flow. The login page can resend a confirmation code when Supabase reports that an account's email is unconfirmed. Email OTP sign-in uses the **Magic Link** template and is not part of the current login flow. Phone OTP requires enabling phone sign-in and adding an SMS provider under **Authentication → Providers → Phone**. Customer orders are synced to Supabase; basket, delivery details, and payment previews are not.

Custom SMTP is enabled in **Authentication → Emails → SMTP Settings** using Gmail SMTP. Supabase warns that personal email providers may have reduced transactional-email deliverability; for reliable delivery to customers, use a dedicated transactional SMTP provider and configure its domain authentication. SMTP credentials belong only in the Supabase dashboard, never in this browser app or its `.env` files.
