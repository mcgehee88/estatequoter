# EstateQuoter Backend Architecture & Data Flow

## Current State
- ✅ Beautiful, sophisticated frontend form with Cloudinary integration
- ✅ Multi-step questionnaire capturing all estate details
- ❌ No backend - form submissions go nowhere
- ❌ No Make.com workflow active
- ❌ No lead persistence or professional dashboard

---

## Optimal Architecture (No-Brainer UX)

### Frontend → Backend → Make.com → CRM/Email

```
User fills form
    ↓
Submits to /api/submit
    ↓
Backend saves to database (instant lead storage)
    ↓
Backend sends to Make.com webhook
    ↓
Make.com triggers:
    • Email to user: "Thanks, pros are reviewing"
    • Webhook to Cloudinary (optional): organize media
    • Database update: mark as "sent to pros"
    • Email to pros: "New lead available" with form data
    ↓
Pros respond with quotes
    ↓
User gets email: "You have X quotes"
    ↓
User returns to dashboard, sees all pros' responses
```

---

## What We Need to Build

### 1. Backend (Node/Bun + Hono) - on Zo
**Location:** `/home/workspace/estatequoter/api.ts`

Routes needed:
- `POST /api/submit` - receive form data + Cloudinary URLs, save locally, trigger Make.com
- `GET /api/leads/:id` - user views their own lead
- `GET /api/leads/:id/quotes` - user sees quotes from pros

Database: Simple JSON files in `/data/` folder (you can upgrade to SQLite later)

### 2. Professional Dashboard (Optional but valuable)
- Simple login for pros (or use email code)
- Shows "New leads" waiting for quotes
- One-click to submit quote/response
- Can be embedded in Make.com or standalone

### 3. Make.com Workflow
**Current role:** Nothing (you mentioned you have it but it's not activated)

**What it should do:**
- Receive webhook from `/api/submit`
- Send "thanks for submitting" email to customer
- Email pros with lead details + Cloudinary gallery link
- Log to spreadsheet or CRM for tracking

### 4. Cloudinary Integration
**Already in your form!** Users upload directly to Cloudinary.

**You need to:**
- Make sure your Cloudinary account is connected
- Grab the Cloudinary public ID from form submissions
- Pass those URLs to Make.com (so pros can see photos)
- Optional: Organize photos in Cloudinary folders by lead ID

---

## Data Flow in Detail

### Step 1: Form Submission
User clicks "Submit" on form. JavaScript collects:
```json
{
  "needs": ["Estate sale", "Cleanout"],
  "property_type": "House",
  "sqft": 2500,
  "beds": 3,
  "baths": 2,
  "extra_rooms": ["Attic", "Basement"],
  "fullness": 3,
  "high_value": ["Antiques"],
  "clearout": "Full clear-out",
  "timeline": "Flexible (30-90 days)",
  "oversized": ["Piano"],
  "access": "Easy ground-level",
  "media": [
    "https://res.cloudinary.com/[your-cloud]/image/upload/v123/lead-1234-img1.jpg",
    "https://res.cloudinary.com/[your-cloud]/video/upload/v123/lead-1234-vid1.mp4"
  ],
  "estimated_value": 400000,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "notes": "Attorney involved, need quick timeline"
}
```

### Step 2: Backend Processes
1. Generate unique `lead_id` (timestamp-based)
2. Save to `/data/leads.json`
3. Log Cloudinary URLs
4. POST to Make.com webhook with full data
5. Return `lead_id` to frontend

### Step 3: Make.com Receives
Webhook payload arrives with all form data.

Make workflow:
1. **Email to customer:**
   - "Thanks for submitting! We're sending this to local pros."
   - Include summary of what they told us
   - Include gallery of photos they uploaded
   - Add link: "Track your quotes: estatequoter.com/dashboard/[lead_id]"

2. **Email to matching professionals:**
   - "New lead in [your area]"
   - Full form summary
   - Cloudinary gallery link
   - "Click here to submit a quote"
   - Professional dashboard link (if you build one)

3. **Optional: Save to spreadsheet**
   - Track submissions, responses, conversions
   - Daily digest for you

### Step 4: Pros Respond
Pros either:
- **Reply via Make.com form** → Goes to your backend → Stored in `/data/quotes.json`
- **Call/text customer directly** (you give them the phone number)

### Step 5: User Dashboard
Customer can log in and see:
- Their original submission summary
- Photos they uploaded
- All pro quotes/responses
- Contact info for each pro

---

## Implementation Roadmap

### Phase 1: MVP (this week)
- ✅ Add `/api/submit` endpoint
- ✅ Save to JSON database
- ✅ POST to Make.com webhook
- ✅ Test end-to-end

### Phase 2: Polish (next week)
- Add `/api/leads/:id` endpoint for user dashboard
- Build simple user dashboard page
- Email verification so users can only see their own leads

### Phase 3: Pro Dashboard (if needed)
- Simple pro interface to view/respond to leads
- Optional: paid subscription for pros

---

## Make.com Setup (You Need to Configure)

Your Make.com account needs:
1. **Webhook receiver** that triggers on POST from your backend
2. **Email modules** (Gmail, or another service)
3. **Spreadsheet module** (optional tracking)

The webhook URL will be something like:
```
https://hook.make.com/your-unique-webhook-id
```

You'll give this URL to me, I'll hardcode it in `/api/submit`.

---

## Security & Data

### Privacy
- Customers can only see their own leads (by email verification)
- Pros only see the form data, not customer's home address initially
- Media stays on Cloudinary (you control access)

### Compliance
- You'll need to add privacy policy (you have one at `/privacy.html`)
- Terms of service (you have one at `/terms.html`)
- GDPR/CCPA compliance if needed

---

## Questions for You

1. **Do you already have a Make.com account set up?** If so, give me the webhook URL.
2. **What email should we use for sending?** (Can be your personal Gmail + Make.com OAuth)
3. **Should pros have a login, or just get emailed?** (Email-only is simpler)
4. **What's your Cloudinary account name?** (For organizing photos)
5. **Want a user dashboard, or just email?** (Email is MVP, dashboard is nice-to-have)

---

## Technical Details

**Backend will be:**
- Hono.js framework (simple, fast)
- Bun runtime (already on Zo)
- JSON file storage (no database setup needed)
- Deployed on Zo as a service (always running)

**Frontend (your existing code):**
- No changes to HTML/CSS
- Modify form submission JS to POST to `/api/submit`
- Optional: add modal for "checking..." while submitting
- Optional: success page with lead tracking link

This is straightforward. Let me know those 5 questions and I'll start building.

