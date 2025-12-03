# EstateQuoter Deployment Checklist

## Current Status
- ✅ Staging: **LIVE** at https://staging--astounding-fox-aec820.netlify.app
- ✅ Form: Captures all lead data to Supabase
- ✅ Admin Dashboard: Shows all leads with password login
- ✅ Database: Complete with all required columns

---

## STAGING (Current)
**Form URL:** https://staging--astounding-fox-aec820.netlify.app  
**Admin URL:** https://staging--astounding-fox-aec820.netlify.app/admin  
**Admin Login:** estatequoter@gmail.com (set password via email reset)

### Staging Configuration in Supabase
**Authentication** → **URL Configuration** → **Redirect URLs**
- Already added: `https://staging--astounding-fox-aec820.netlify.app/admin`

---

## PRODUCTION (When Ready)
You'll need to:

1. **Push staging branch to main** in GitHub
2. **Set up production domain** (estatequoter.com)
3. **Configure Netlify for production** (different domain)
4. **Add production URL to Supabase Redirect URLs:**
   ```
   https://estatequoter.com/admin
   ```
5. **Update admin.html** with production Supabase URL (if needed)

---

## How to Know When You're Ready
- [ ] Form works on staging and captures leads
- [ ] Admin dashboard shows leads (password login works)
- [ ] You've tested with real submissions
- [ ] You're ready to go live to customers

**When all checked:** Tell me and I'll help you deploy to production in ONE SHOT.

---

## Key Logins
- **Admin Dashboard Password:** estatequoter@gmail.com (set via Supabase email reset)
- **Supabase:** dzqjvsabwijgwbhfjzqq.supabase.co
- **GitHub:** mcgehee88/estatequoter (staging branch is live)

---

## What NOT to Change
- Don't touch database schema unless I tell you
- Don't change Supabase RLS settings
- Don't modify admin.html unless instructed

**Questions?** Ask before making changes.

