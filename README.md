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

## Notes

- The storefront is ready for local storefront testing.
- Payment and live backend integrations can be added once credentials are provided.
- Admin dashboard data is currently stored in localStorage for a mock backend setup.
