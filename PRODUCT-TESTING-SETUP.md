# Product Testing setup

The three public pages are `/product-testing`, `/product-testing/students` and `/product-testing/startups`. Both forms POST to `/api/product-testing`. They do not need a Supabase migration or open an email app.

## Configure email in Vercel

1. In [Resend Domains](https://resend.com/domains), add an AARAMBH domain you control, such as `aarambh-community.in` or `updates.aarambh-community.in`. Add the DNS records Resend gives you at your domain's DNS provider and wait until Resend reports the domain **Verified**. Keep existing website and mail records intact; use a sending subdomain if appropriate for your DNS setup.
2. Create a Resend API key with sending permission for that domain.
3. Open the existing `aarambh-website` project in Vercel → Settings → Environment Variables. Set:

   | Variable | Value |
   | --- | --- |
   | `RESEND_API_KEY` | Your actual Resend sending API key |
   | `PRODUCT_TESTING_FROM` | `AARAMBH Community <product-testing@aarambh-community.in>` or an address on your verified AARAMBH subdomain |

   Enable these for **Production**, and for **Preview** only if preview forms should send real emails. Do not use a `VITE_` prefix: those variables are bundled into the browser. The address above is an example, not a claim that it is verified. Gmail and `onboarding@resend.dev` are deliberately rejected as senders. Keep the existing Supabase variables as they are.
4. Redeploy after saving the variables. Use Vercel's supported Node.js runtime (Node 22 or newer). The committed Vercel configuration reserves `/api/*` for server functions and keeps existing SPA page routes working.
5. Submit one clearly labelled test application on each deployed page using an email address you control. Confirm the submission succeeds, then check Resend's email log and the actual inbox (including Spam). In the received email, click Reply and verify that it addresses the applicant.

Every application goes to `aarambh.community.team@gmail.com`; the recipient cannot be changed by a submitted form. The server sets Reply-To to the validated applicant email and includes every form field in plain text. Blank optional values appear as “Not provided”. Subjects are:

- `[AARAMBH] Student Tester Application — {name}`
- `[AARAMBH] Startup Pilot Application — {startup name}`

The site reports success only after Resend returns a successful response with an email ID. **Provider acceptance is not confirmation of delivery to the Gmail inbox.** A missing/incorrect configuration, provider rejection or network timeout shows a retry message and leaves all form answers in place. Applications are not separately stored in a database; failed submissions must be retried before leaving/reloading the page.

## Local development and checks

Copy the placeholders in `.env.example` into your ignored `.env.local` and replace them only when you want local forms to send real mail. `npm run dev` serves the same endpoint through a server-only Vite development middleware. Without email variables it returns a failure, never a pretend success. `npm run preview` serves static output only; test email locally through `npm run dev`, or through a Vercel deployment.

```powershell
npm test
npm run check
# Match the production Vercel build, which generates metadata without Chrome:
$env:VERCEL = '1'
npm run build
Remove-Item Env:VERCEL
```

`tests/product-testing.test.mjs` uses an injected fake email provider, so it sends **no real email**. It verifies both form payloads, required/optional fields, invalid data, the recipient and Reply-To, every email field, missing configuration, spam checks, throttling, provider rejections/timeouts and retry deduplication. Browser checks should also cover 320px/mobile and desktop, keyboard focus, CTA anchors, mobile navigation, duplicate clicks, retained answers on failure and success states for both forms.

## Spam and retry behavior

- Server-side allowlisted fields, type/length checks, email/HTTP URL validation, control-character cleanup, JSON-only requests and a 32 KiB request limit.
- Honeypot, a minimum 1.5-second fill time and same-origin checks when Origin is present. The fill timer is a basic bot heuristic, not a security credential.
- Up to 8 attempts per IP per 10 minutes **per warm function instance**. The bounded in-memory limiter is best effort: cold starts and multiple instances do not share it. For deployment-wide abuse protection, configure a Vercel Firewall rate-limit rule on POST `/api/product-testing` and monitor Resend usage. The app does not rely on a fictitious global rate limit.
- The submit button and fields are disabled during sending, with an immediate guard against repeat clicks. An email-content hash is sent as a [Resend idempotency key](https://resend.com/docs/dashboard/emails/idempotency-keys), so identical retries within Resend's 24-hour window do not send duplicate email. Editing an answer creates a distinct request. No applicant details or API keys are logged by this endpoint.

Official references: [Resend sending API](https://resend.com/docs/api-reference/emails/send-email), [Vercel Functions with Vite](https://vercel.com/docs/frameworks/frontend/vite).
