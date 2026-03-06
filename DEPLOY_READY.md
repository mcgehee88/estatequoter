# EstateQuoter - Ready to Deploy

## 🎯 What I Built

### 1. Updated Form (index.html)
- Sends to Make.com webhook instead of broken API
- Keeps "My Submissions" for users
- All your beautiful form steps preserved

### 2. Simple Admin (admin-simple.html)
- Google Sheets powered
- No broken APIs
- Master view of all leads
- Pro view available

### 3. Pro System (pro.html + pro-dashboard.html)
- Registration page for professionals
- Individual dashboards
- Unique URLs like `?pro=john-doe`

---

## 🚀 Deploy These Changes

1. **Commit to GitHub:**
```bash
cd /home/workspace/estatequoter
git add .
git commit -m "Fix: Make.com integration + new admin system"
git push origin staging
```

2. **Check staging URL:** https://staging--astounding-fox-aec820.netlify.app

3. **Test form submission**

4. **Merge to main when ready**

---

## ⚙️ Make.com Setup (5 minutes)

Since API automation isn't working, here's the simple manual setup:

### Step 1: Create Webhook
1. Go to https://www.make.com
2. Click **"Scenarios"** → **"Create a new scenario"**
3. Search **"Webhooks"** → **"Custom webhook"**
4. Click **"Add"** → Name it "EstateQuoter Intake"
5. Copy the webhook URL (starts with `https://hook.us2.make.com/...`)

### Step 2: Add Google Sheets
1. Click **"+"** next to webhook
2. Search **"Google Sheets"** → **"Add Row"**
3. Connect: **"My Google connection"** (you already have this)
4. Spreadsheet: **"Create a new spreadsheet"**
5. Name: **"EstateQuoter Leads"**
6. Map these fields from webhook data:
   - `{{1.customer_name}}` → Name column
   - `{{1.customer_email}}` → Email column
   - `{{1.customer_phone}}` → Phone column
   - `{{1.zip}}` → ZIP column
   - `{{1.property_type}}` → Property column
   - `{{1.needs}}` → Services column
   - `{{1.pro_slug}}` → Pro Source column
   - `{{1.created_at}}` → Date column

### Step 3: Add Email Notification
1. Click **"+"** after Sheets
2. Search **"Gmail"** → **"Send Email"**
3. To: **contact@estatequoter.com**
4. Subject: `New EstateQuoter Lead: {{1.customer_name}}`
5. Body: 
```
New lead submitted!

Name: {{1.customer_name}}
Email: {{1.customer_email}}
Phone: {{1.customer_phone}}
ZIP: {{1.zip}}
Services: {{1.needs}}
Pro Source: {{1.pro_slug}}

View all leads: https://docs.google.com/spreadsheets/d/[YOUR_SHEET_ID]
```

### Step 4: Save & Activate
1. Click **"Save"**
2. Click **"Run once"** (to test)
3. Toggle **"ON"** to activate

---

## 🔧 Update Your Code

After you have the webhook URL, I need to update `index.html`. **Just paste it here** and I'll plug it in.

---

## 📊 Admin Dashboard

Your new admin is at: `/admin-simple.html`

To use it:
1. Get your Google Sheet "share" link (anyone with link can view)
2. Update `admin-simple.html` with that URL
3. Deploy

---

## ✅ Testing Checklist

- [ ] Submit test form → Should go to Make.com
- [ ] Check Google Sheet → New row appears
- [ ] Check email → Notification received
- [ ] Check admin → Lead visible

**Ready to start? Give me your Make.com webhook URL when you have it.**
