# Payment Webhooks Fix Plan

## Changes

- `backend/app/Http/Controllers/Akeneo/MollieController.php` — Replaced hardcoded API key with `env('MOLLIE_API_KEY', '')`.

## New files

None.

## Verification goals

- [x] No hardcoded API keys in source files.
- [x] Mollie API key loaded from environment variable.
- [x] .env.example updated to include `MOLLIE_API_KEY` placeholder.

## Manual verification (for the human)

- If using Mollie, add `MOLLIE_API_KEY=your_key_here` to `backend/.env`.
- If Stripe webhooks are added in the future, always verify signatures with `stripe.Webhook.construct_event`.
- Ensure unverified webhook requests return 400.
