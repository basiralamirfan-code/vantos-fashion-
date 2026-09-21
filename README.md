# VANTOS FASHION

Modern luxury fashion storefront built with React + Vite.

## Quick start

```bash
npm install
npm run dev -- --host 0.0.0.0
```

## Configuration

Copy `.env.example` to `.env` and update the values before launch.

- `VITE_WHATSAPP_NUMBER`: your WhatsApp number without the plus sign or spaces
- `VITE_ADMIN_PASSCODE`: admin login passcode for the dashboard
- `VITE_RAZORPAY_KEY_ID`: public Razorpay key
- `VITE_CASHFREE_APP_ID`: public Cashfree app ID
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase public anon key

## Notes

- The storefront is ready for local storefront testing.
- Supabase scaffolding is in `src/supabaseClient.js` and `supabase/schema.sql`.
- Run `supabase/schema.sql` in the Supabase SQL editor before connecting shared orders.
- The app currently uses localStorage until Supabase credentials and server-side admin rules are configured.
- Never expose a Supabase service-role key in frontend environment variables.
