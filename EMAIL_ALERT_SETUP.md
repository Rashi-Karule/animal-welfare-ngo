# Missing Pet Newsletter Alerts Setup

This project now includes hooks to email newsletter subscribers when:

- A new missing pet report is created (`missing_reported`)
- A pet is marked as found (`pet_found`)

## 1) Deploy the Supabase Edge Function

From the `animal-welfare-ngo/` folder:

```bash
supabase login
supabase link --project-ref jstvrnpostcpzywpdpve
supabase functions deploy missing-pet-notify
```

## 2) Set required secrets

You need a Resend account and a verified sender email/domain.

```bash
supabase secrets set RESEND_API_KEY=YOUR_RESEND_API_KEY
supabase secrets set RESEND_FROM_EMAIL="Juno Alerts <alerts@yourdomain.com>"
```

Supabase already provides:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

for Edge Functions at runtime.

## 3) Copy function invoke URL

Use:

```bash
supabase functions list
```

Then set this URL in both files:

- `js/script.js` -> `MISSING_PET_NOTIFY_FUNCTION_URL`
- `admin.html` -> `MISSING_PET_NOTIFY_FUNCTION_URL`

Expected format:

`https://jstvrnpostcpzywpdpve.functions.supabase.co/missing-pet-notify`

## 4) Redeploy website

Push to GitHub and redeploy on Vercel.

## 5) Test

1. Subscribe with a real email from home page newsletter form.
2. Submit a missing pet report on `missing-pet.html`.
3. Check inbox for "Missing Pet Alert".
4. In `admin.html`, mark that pet as found.
5. Check inbox for "pet found" update.

## Notes

- If function URL is blank in the frontend files, no email call is made.
- Email sending failures never block form submissions/admin actions.
