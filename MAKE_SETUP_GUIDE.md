# EstateQuoter Make.com Setup Guide

## ✅ What's Already Done
- Form updated to send to Make.com webhook
- Admin dashboard created (admin-simple.html)
- Test submission ready

## 🎯 Make.com Scenario to Build

### Step 1: Create Webhook
1. Go to Make.com → Scenarios → Create
2. Add module: **"Webhooks > Custom webhook"**
3. Name it: "EstateQuoter Lead Intake"
4. Click "Save" - this gives you a webhook URL
5. **Copy that URL** and replace in index.html:
   ```javascript
   const webhookURL = "YOUR_NEW_WEBHOOK_URL";
   ```

### Step 2: Add Google Sheets Module
1. Add module: **"Google Sheets > Add Row"**
2. Connect your Google account (contact@estatequoter.com)
3. Create new spreadsheet: "EstateQuoter Master Leads"
4. Sheet name: "Leads"
5. Map these fields:
   - Column A: `{{formatDate(now; "YYYY-MM-DD HH:mm")}}`
   - Column B: `{{1.customer_name}}`
   - Column C: `{{1.customer_email}}`
   - Column D: `{{1.customer_phone}}`
   - Column E: `{{1.zip}}`
   - Column F: `{{1.property_type}}`
   - Column G: `{{1.needs}}`
   - Column H: `{{1.pro_slug}}`
   - Column I: `{{1.fullness}}`
   - Column J: `{{1.timeline}}`
   - Column K: `{{1.notes}}`
   - Column L: `{{1.media_count}}`
   - Column M: `New` (status)

### Step 3: Add Email Notification (You)
1. Add module: **"Gmail > Send Email"**
2. To: contact@estatequoter.com
3. Subject: `New Lead: {{1.customer_name}} ({{1.zip}})`
4. Body:
```
New EstateQuoter submission!

Name: {{1.customer_name}}
Email: {{1.customer_email}}
Phone: {{1.customer_phone}}
ZIP: {{1.zip}}
Property: {{1.property_type}}
Needs: {{1.needs}}
Timeline: {{1.timeline}}

View in Sheet: [Link to your Google Sheet]
```

### Step 4: Optional - Pro Notification
1. Add **"Router"** to split flow
2. Add **"Gmail > Send Email"** (second branch)
3. Set filter: `{{1.pro_slug}}` exists
4. To: (you'll need to look up pro email from a sheet)

### Step 5: Test
1. Turn scenario ON
2. Submit a test form at staging URL
3. Check Make.com logs
4. Verify row appears in Google Sheet
5. Check email notification

## 🔗 Current Webhook URL (Change This!)
The form currently sends to:
```
https://hook.us2.make.com/yp7lklk38381i0lubdj2v02v1v4es9s3
```

**If this is wrong**, update it in `index.html` line ~1979:
```javascript
const webhookURL = "YOUR_CORRECT_WEBHOOK_URL";
```

## 📊 Admin Dashboard
Access: `https://your-site.com/admin-simple.html`
- Login: contact@estatequoter.com / estatequoter2025 (change this!)
- Shows embedded Google Sheet with all leads
- Separate tab for professionals

## ✅ Test Submission
Want me to test? Just say "test now" and I'll submit a test lead to verify everything works.
