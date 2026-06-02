# SKU_System

## Security: Supabase Key Rotation
If an anon or service key is exposed, rotate it immediately in the Supabase dashboard.

Steps:
1. Open your Supabase project → Settings → API.
2. Rotate the `anon` key (or service_role key server-side only).
3. Update your local `.env` with the new `REACT_APP_SUPABASE_ANON_KEY` and `REACT_APP_SUPABASE_URL`.
4. Redeploy frontend with new env values and verify functionality.
5. Revoke old keys if no longer needed and confirm CORS origins are restricted.

Do NOT commit real keys to source control. Use `.env` and add it to `.gitignore`.