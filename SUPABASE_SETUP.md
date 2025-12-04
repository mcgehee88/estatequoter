# Supabase Setup Instructions

## Step 1: Run the Database Schema

1. Go to https://supabase.com/dashboard/project/dzqjvsabwijgwbhfjzqq/sql
2. Click **"New Query"**
3. Copy the entire contents of `DATABASE_SCHEMA.sql` in this repository
4. Paste it into the editor
5. Click **"Run"**

This creates all the tables needed for EstateQuoter.

## Step 2: Enable Environment Variables in Netlify

1. Go to your Netlify site settings
2. Build & deploy → Environment
3. Add these variables (from Supabase):
   - `SUPABASE_URL` = https://dzqjvsabwijgwbhfjzqq.supabase.co
   - `SUPABASE_ANON_KEY` = [your anon key]
   - `SUPABASE_SECRET_KEY` = sb_secret_QovMs9AGtFX5D_Jc7RFL5Q_z4ozbDEx
   - `ADMIN_TOKEN` = [set a secure admin token for dashboard access]
   - `MAKE_COM_WEBHOOK_URL` = https://hook.make.com/your-workflow-id (add if using Make.com)

## Step 3: Verify Setup

After Netlify redeploys, test the endpoints:

```bash
curl -X POST https://staging--astounding-fox-aec820.netlify.app/api/submit-lead \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test User",
    "customer_email": "test@example.com",
    "property_type": "residential",
    "estate_location": "New York"
  }'
```

Should return a `201` status with a `lead_id`.

## Status

- [x] Database schema created
- [x] Netlify Functions written
- [ ] Supabase schema deployed
- [ ] Environment variables set in Netlify
- [ ] Frontend forms updated to use new API
- [ ] Professional dashboard built
- [ ] Admin dashboard built

