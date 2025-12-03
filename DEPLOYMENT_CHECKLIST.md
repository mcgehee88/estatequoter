# EstateQuoter Pro System - Deployment Checklist

## Pre-Deployment Review

### Database
- [ ] Review `SUPABASE_SCHEMA_UPDATE.sql` 
- [ ] Verify you have Supabase admin access
- [ ] Backup existing database (optional but recommended)

### Backend Functions
- [ ] Review `netlify/functions/pro-register.js`
- [ ] Review `netlify/functions/submit-lead.js` (updated version)
- [ ] Review `netlify/functions/get-pro-leads.js`
- [ ] Review `netlify/functions/admin-all-leads.js`
- [ ] Confirm all functions have Supabase URL + KEY in environment

### Frontend
- [ ] Review `index.html` (updated form)
- [ ] Review `pro.html` (updated registration)
- [ ] Review `admin.html` (updated dashboard)
- [ ] Review `pro-dashboard.html` (new professional dashboard)

---

## Step 1: Supabase Schema Deployment

### Action Items
- [ ] Open Supabase SQL Editor
- [ ] Paste contents of `SUPABASE_SCHEMA_UPDATE.sql`
- [ ] Click "Run"
- [ ] Wait for completion (should be ~30 seconds)

### Verification
```sql
-- Run these queries to verify tables exist:
SELECT COUNT(*) FROM professionals;
SELECT COUNT(*) FROM lead_media;
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'leads' AND column_name = 'professional_id';
```
- [ ] `professionals` table exists (0 rows initially)
- [ ] `lead_media` table exists (0 rows initially)
- [ ] `leads` table has `professional_id` column

---

## Step 2: Backend Function Deployment

### Upload to Netlify
Choose your deployment method:

#### Option A: Git Push (Recommended)
```bash
# From your Git repo root:
git add netlify/functions/pro-register.js
git add netlify/functions/submit-lead.js
git add netlify/functions/get-pro-leads.js
git add netlify/functions/admin-all-leads.js
git commit -m "Add EstateQuoter Pro system backend"
git push origin main
```
- [ ] Functions pushed to repo
- [ ] Netlify auto-deployed (check Netlify dashboard)

#### Option B: Netlify UI Upload
1. Go to Netlify dashboard > Your site > Functions
2. Upload each `.js` file individually
- [ ] All 4 functions show in Netlify dashboard

### Verification
Test each function endpoint:

```bash
# Test pro-register (should return 405 since no POST data)
curl -i https://yourdomain.com/.netlify/functions/pro-register

# Test submit-lead (should return 405)
curl -i https://yourdomain.com/.netlify/functions/submit-lead

# Test get-pro-leads (should return 401 - missing professional_id)
curl -i https://yourdomain.com/.netlify/functions/get-pro-leads

# Test admin-all-leads (should return leads)
curl -i https://yourdomain.com/.netlify/functions/admin-all-leads
```

- [ ] pro-register returns 405 (method not allowed)
- [ ] submit-lead returns 405
- [ ] get-pro-leads returns 401 or 200
- [ ] admin-all-leads returns 200 with lead data

---

## Step 3: Frontend File Deployment

### Files to Deploy
- [ ] Replace `index.html` (updated form with pro slug + media)
- [ ] Replace `pro.html` (updated registration with backend)
- [ ] Replace `admin.html` (updated dashboard)
- [ ] Add NEW file: `pro-dashboard.html`

### Deployment Method
Choose one:

#### Option A: Git + Netlify Auto Deploy
```bash
git add index.html pro.html admin.html
git add pro-dashboard.html  # new file
git commit -m "Update EstateQuoter UI with Pro system"
git push origin main
```
- [ ] Files committed to repo
- [ ] Netlify auto-deployed

#### Option B: Direct Netlify Upload
1. Go to Netlify dashboard > Your site
2. Drag & drop files to deploy
- [ ] Files uploaded

### Verification (Browser)
- [ ] `https://yourdomain.com/` loads (form)
- [ ] `https://yourdomain.com/pro.html` loads (pro registration)
- [ ] `https://yourdomain.com/admin.html` loads (admin dashboard)
- [ ] `https://yourdomain.com/pro-dashboard.html` loads (pro dashboard)

---

## Step 4: Environment Variables

### Netlify Function Secrets
Verify these are set in Netlify > Site Settings > Build & Deploy > Environment:

- [ ] `SUPABASE_URL` = Your Supabase URL
- [ ] `SUPABASE_SECRET_KEY` = Your Supabase service_role key (SECRET, not anon key)

Or in `.env.production` if using local env file:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your_service_role_key_here
```

---

## Step 5: Test Pro Registration Flow

### Test Scenario A: Create New Pro Account
1. Open `https://yourdomain.com/pro.html` in browser
2. Click "Get My Free Pro Link" button
3. Fill in the form:
   - Company: "Test Estate Company"
   - Your Name: "Jane Doe"
   - Email: "jane@example.com"
   - Phone: "555-1234"
   - Service Area: "Hampton Roads, VA"
   - Slug: "jane-estates"
4. Click "Create my free link"

### Expected Results
- [ ] Form submitted successfully
- [ ] Success screen appears
- [ ] Link shown: `https://yourdomain.com/?pro=jane-estates`
- [ ] Dashboard link provided
- [ ] Copy button works

### Verify in Supabase
```sql
SELECT * FROM professionals WHERE slug = 'jane-estates';
```
- [ ] Record exists
- [ ] All fields populated correctly

---

## Step 6: Test Lead Submission via Pro Link

### Test Scenario B: Submit Lead Using Pro Link
1. Open `https://yourdomain.com/?pro=jane-estates` in browser
2. Verify hero text says "from Jane Estates" (or similar pro branding)
3. Fill out the complete form:
   - ZIP: 23451
   - Role: Select something
   - Needs: Select something
   - Property Type: House
   - Sq Ft: 2500
   - Beds: 3
   - Baths: 2
   - Extra rooms: Select something
   - Fullness: Full
   - High value: Select something
   - Clear out: Select something
   - Timeline: Flexible
   - Oversized: Select something
   - Access: Easy access
   - PHOTOS: Upload 1-2 test images (optional)
   - Home value: 400000
   - Name: "John Customer"
   - Email: "john@example.com"
   - Phone: "555-5678"
   - Notes: "Test submission"
4. Click "Submit request"

### Expected Results
- [ ] Success modal appears ("Thanks! You're all set")
- [ ] Review submission screen shows (with "Edit answers" button)
- [ ] No errors in browser console

### Verify in Supabase
```sql
-- Check the lead was created
SELECT * FROM leads WHERE customer_name = 'John Customer' ORDER BY created_at DESC LIMIT 1;

-- Should have:
-- - professional_id = jane-estates professional's id
-- - pro_slug = 'jane-estates'
-- - All form fields populated
-- - media_count = 1 (or 2 if you uploaded 2 images)
```

```sql
-- Check media was linked
SELECT * FROM lead_media WHERE lead_id = (
  SELECT id FROM leads WHERE customer_name = 'John Customer' LIMIT 1
);
-- Should show uploaded images
```

- [ ] Lead exists with professional_id set
- [ ] pro_slug = 'jane-estates'
- [ ] All 30+ form fields have values
- [ ] Media records exist if images were uploaded

---

## Step 7: Test Admin Dashboard

### Test Scenario C: Admin Views All Leads
1. Open `https://yourdomain.com/admin.html` in browser
2. Login with admin credentials
3. Should see "Jane's" test lead in the table

### Expected Results
- [ ] Dashboard loads without errors
- [ ] Statistics update (Total, Open, Quoted, Closed)
- [ ] Your test lead appears in table
- [ ] Can search for "John Customer"
- [ ] Can filter by status
- [ ] Can click "View" to see full details

### Verify Detail Modal
- [ ] Modal opens when clicking "View"
- [ ] Shows all form fields (30+ fields)
- [ ] Shows uploaded photos in media gallery
- [ ] No errors in console

---

## Step 8: Test Professional Dashboard

### Test Scenario D: Pro Views Their Leads Only
1. Open `https://yourdomain.com/pro-dashboard.html` in browser
2. Login with professional credentials:
   - Email: jane@example.com
   - Password: (use the password you set when creating the account)
   
Note: If pro login doesn't work yet, it's because you haven't set up user accounts in Supabase Auth. See troubleshooting below.

### Expected Results
- [ ] Dashboard loads
- [ ] Professional's link displayed: `https://yourdomain.com/?pro=jane-estates`
- [ ] Statistics show (should have 1 lead total, open)
- [ ] Test lead appears in table
- [ ] Can click "View" to see full details + media

---

## Step 9: Verify Zero Breaking Changes

### Test Organic Lead (No Pro Link)
1. Open `https://yourdomain.com/` (without ?pro= param)
2. Hero text should be generic: "Estate liquidation quotes, without the hassle"
3. Fill out and submit form normally
4. Should work exactly as before

### Verify in Supabase
```sql
SELECT * FROM leads WHERE professional_id IS NULL LIMIT 1;
```
- [ ] New organic lead exists with NULL professional_id

### Test Old Admin Functionality
1. Go to admin dashboard
2. Should see ALL leads (both pro and organic)
3. All data should display correctly

- [ ] Organic leads still work
- [ ] Admin sees all leads (pro + organic)
- [ ] No existing functionality broken

---

## 🚨 Troubleshooting Checklist

### Functions Not Working
- [ ] Check Netlify Functions logs: Netlify Dashboard > Functions > Logs
- [ ] Verify SUPABASE_URL + SUPABASE_SECRET_KEY are set
- [ ] Try calling function directly with curl
- [ ] Check for 500 errors in logs

### Pro Registration Fails
- [ ] Check browser Network tab for failed requests
- [ ] Verify `/.netlify/functions/pro-register` is accessible
- [ ] Check Netlify function logs for errors
- [ ] Confirm Supabase can insert new rows

### Pro Dashboard Login Fails
- [ ] Confirm professional email exists in Supabase Auth users
- [ ] Check that the user password was set (manually create if needed)
- [ ] Verify professionals table has matching email record
- [ ] Try admin credentials first to verify auth works

### Media Not Showing
- [ ] Verify Cloudinary URLs in lead_media table are correct
- [ ] Try opening Cloudinary URL directly in browser
- [ ] Check browser console for image load errors
- [ ] Verify media files were actually uploaded to Cloudinary

### Leads Not Routed to Professional
- [ ] Verify pro_slug was sent in form submission
- [ ] Check that professional with that slug exists
- [ ] Confirm professional_id was set on lead record
- [ ] Re-test form submission with correct slug

---

## 🎉 Post-Deployment

### Mark as Complete
- [ ] All tests passed
- [ ] No breaking changes
- [ ] Pro registration working
- [ ] Lead routing working
- [ ] Both dashboards functional

### Next Steps (Optional)
- [ ] Set up email notifications for new leads
- [ ] Create additional professional test accounts
- [ ] Train team on using admin + pro dashboards
- [ ] Monitor logs for first week
- [ ] Plan Phase 2 enhancements (payment, branding, etc.)

### Announcement (When Ready)
- [ ] Send pro link generation instructions to existing professionals
- [ ] Update website to highlight Pro features
- [ ] Create onboarding email for new professionals

---

## 📊 Quick Health Check

Run this query monthly to verify system health:

```sql
SELECT
  COUNT(DISTINCT professional_id) as active_pros,
  COUNT(*) as total_leads,
  COUNT(CASE WHEN status = 'open' THEN 1 END) as open_leads,
  COUNT(CASE WHEN professional_id IS NOT NULL THEN 1 END) as pro_routed_leads,
  COUNT(CASE WHEN professional_id IS NULL THEN 1 END) as organic_leads
FROM leads
WHERE created_at > NOW() - INTERVAL '30 days';
```

---

## ✅ System Ready!

Once all checkboxes are complete, the EstateQuoter Pro system is fully deployed and operational. Professionals can:
- Register for free pro links
- Share branded intake URLs
- View all leads routed to them
- See complete form data + photos
- Use the system at no cost

Admins can:
- See all leads from all sources
- View professional information
- Track routing efficiency
- Manage the overall system

