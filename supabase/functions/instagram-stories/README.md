# Instagram Stories → Newsac web

Instagram **does not** allow public embed of 24h Stories. Live stories on newsac.mn need the **Instagram Graph API** (Professional account).

## What the app does

- Home story rail always shows an **Instagram** chip for `@newsac_channel`.
- If Edge Function returns active stories → they open in an in-app Story viewer.
- If not configured / no active story → chip opens [Instagram Stories](https://www.instagram.com/stories/newsac_channel/).

## Setup (once)

1. Instagram → Professional (Creator/Business) for `newsac_channel`.
2. Link the account to a Facebook Page.
3. [Meta for Developers](https://developers.facebook.com/) → create an app → add **Instagram Graph API**.
4. Generate a **long-lived Page access token** with permissions such as:
   - `instagram_basic` / `instagram_manage_insights` (as required by current Meta docs)
   - `pages_show_list`, `pages_read_engagement`
5. Resolve `IG_USER_ID` (Instagram Business Account id linked to the Page).
6. Set Supabase secrets and deploy:

```bash
supabase secrets set IG_ACCESS_TOKEN="EAAB..." IG_USER_ID="1784..." IG_USERNAME="newsac_channel"
supabase functions deploy instagram-stories --no-verify-jwt
```

CMS YouTube stories in Admin → Story keep working independently.
