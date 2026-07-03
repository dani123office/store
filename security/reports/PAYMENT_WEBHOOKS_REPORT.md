# Payment Webhooks Security Report

## Status: MEDIUM

## Findings

Audited all payment-related controllers:

1. **MollieController (`backend/app/Http/Controllers/Akeneo/MollieController.php`)**:
   - **CRITICAL**: Had a hardcoded Mollie test API key: `test_zHW4Pxcn7kDjcm6Fx22W4FygE75xSJ`
   - **FIX**: Moved to environment variable `MOLLIE_API_KEY`.
   - No webhook handling implemented for Mollie — only redirect-based payment flow.

2. **PaymentController (`backend/app/Http/Controllers/Api/PaymentController.php`)**:
   - Returns all payments (admin-only route, protected by auth:sanctum+admin).
   - No Stripe integration or webhook endpoints.

3. **No Stripe usage**: No Stripe SDK dependency, no webhook endpoints, no signature verification.

## What's at risk

Hardcoded API keys in source code can be exposed via repository access. The test key (`test_` prefix) is lower risk than a live key but still a credential leak. Without webhook signature verification, fake payment notifications could be accepted.

## What's already secure

- Hardcoded key has been moved to environment configuration.
- Payment controller is admin-only.
- No payment processing that relies on insecure webhooks.

## Recommendations

- **If Stripe is integrated in the future**: Always verify webhook signatures with `stripe.Webhook.construct_event`, track processed event IDs for idempotency.
- **For Mollie**: Move away from this controller or properly implement webhook signature verification.
