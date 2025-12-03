# Make.com Integration Audit

## Current Status

**Status:** Not actively configured
- No Make.com workflows currently active
- No webhooks currently receiving data
- No email routing set up
- Backend referenced in BACKEND_STRATEGY.md but not implemented

---

## Make.com Data Flow (As Designed)

### Endpoints the Frontend Hits

Currently: **NONE** – form goes nowhere

After implementation:
- `POST https://estatequoter.com/api/submit` – Frontend submits form data
  - Backend receives and saves to database
  - Backend then calls Make.com webhook

### Make.com Webhook URL

**Not yet configured.** When set up:
```
https://hook.make.com/[unique-id-here]
```

### Data Sent to Make.com

**Payload structure:**
```json
{
  "lead_id": "1733230415-12345",
  "timestamp": "2025-12-03T15:10:00Z",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234"
  },
  "property": {
    "type": "House",
    "sqft": 2500,
    "beds": 3,
    "baths": 2,
    "extra_rooms": ["Attic", "Basement"],
    "fullness": 3,
    "condition": "mixed"
  },
  "services_needed": ["Estate sale", "Cleanout"],
  "high_value_items": ["Antiques", "Vintage furniture"],
  "oversized_items": ["Piano", "Pool table"],
  "clearout_preference": "Full clear-out",
  "timeline": "Flexible (30-90 days)",
  "access": "Easy ground-level",
  "location": {
    "city": "Richmond",
    "state": "VA",
    "region": "Central Virginia"
  },
  "media": {
    "images": [
      "https://res.cloudinary.com/[cloud]/image/upload/v123/[id].jpg"
    ],
    "videos": [
      "https://res.cloudinary.com/[cloud]/video/upload/v123/[id].mp4"
    ]
  },
  "estimated_value": 400000,
  "referral_source": "organic",
  "notes": "Attorney involved, need quick timeline"
}
```

---

## What Each Make.com Module Should Do

### 1. **Email to Customer** (Confirmation)

**Trigger:** Webhook received  
**Template:**
```
Subject: We received your estate quote request

Hi [customer.name],

Thank you for submitting your estate details to EstateQuoter. We've shared your information with local professionals who specialize in estate sales and cleanouts.

Here's what we received from you:
- Property: [property.beds]-bed [property.type] in [location.city], [location.state]
- Services needed: [services_needed joined]
- Timeline: [timeline]
- Photos uploaded: [media.images count]
- Estimated value: $[estimated_value]

Local professionals are reviewing your case. You'll hear from them within 24-48 hours with quote options.

In the meantime, you can track your quotes here:
[estatequoter.com/dashboard/[lead_id]]

Questions? Reply to this email or call [support number]

– EstateQuoter Team
```

**Status:** ✅ Critical - must implement

### 2. **Email to Matching Professionals**

**Trigger:** Webhook received  
**Routing:** Geographic + service type matching  
**Template:**
```
Subject: New lead: [property.beds]-bed estate in [location.city]

Hi [pro.company_name],

You have a new lead through EstateQuoter.

Property Details:
- Type: [property.type]
- Size: [property.sqft] sq ft, [property.beds] bed(s), [property.baths] bath(s)
- Fullness level: [property.fullness]/5
- Timeline: [timeline]
- Estimated value: $[estimated_value]
- Special items: [oversized_items joined]
- High-value items: [high_value_items joined]

What they want:
[services_needed as bullet list]

Contact info for follow-up:
- Name: [customer.name]
- Phone: [customer.phone]
- Email: [customer.email]

📸 Client photos: [link to Cloudinary gallery]

Ready to submit a quote?
[Link to pro dashboard or quote form]

---

This lead came through EstateQuoter. Your response time and professionalism help us match families with the right professionals.

– EstateQuoter Team
```

**Status:** ⚠️ Partially implemented - needs pro routing logic

### 3. **Log to Google Sheets** (Optional but valuable)

**Trigger:** Webhook received  
**Spreadsheet:** EstateQuoter Lead Tracking  
**Columns:**
- Timestamp
- Lead ID
- Customer name
- Email
- Phone
- City/State
- Services needed
- Property type
- Estimated value
- Referred from (source)
- Status (submitted/emailed-to-pros/quoted/closed)
- Pros assigned

**Status:** ✅ Nice-to-have for tracking

---

## What's Currently Working

❌ **Nothing** – the form doesn't submit anywhere

---

## What's Currently Broken

❌ **Everything in the pipeline:**
1. Frontend form has no submission endpoint
2. No backend to receive and store data
3. No Make.com webhook configured
4. No pro routing logic
5. No email notifications
6. No user dashboard to track quotes
7. No pro interface to submit quotes

---

## Critical Parts That Must Be Preserved

1. **Intake form UX** – Keep exact same questions and flow
2. **Cloudinary integration** – Form already uploads to Cloudinary, keep this
3. **Privacy** – Customer data only sent to relevant professionals
4. **Timeline** – From form submission to pro notification should be < 1 minute

---

## Migration Plan: Replace Make.com Only When Appropriate

### When to Keep Make.com:
- ✅ Simple email routing only
- ✅ Spreadsheet logging for analytics
- ✅ One-off tasks that don't need to scale

### When to Replace with Backend:
- ✅ Lead storage (database > Make.com)
- ✅ User authentication (backend > Make.com)
- ✅ Lead tracking & dashboard
- ✅ Pro assignment logic (complex rules)
- ✅ Instant quote calculations

### Hybrid Approach (Recommended):

```
Frontend → Backend (/api/submit)
    ↓
    Save to database
    ↓
    Make.com webhook
    ↓
    Email + Spreadsheet logging
    ↓
    Pro responses → Backend (/api/submit-quote)
    ↓
    User dashboard shows all quotes
```

**Benefits:**
- Reliable data storage (backend handles it)
- Simple email workflow (Make.com handles it)
- Professional dashboard (backend builds it)
- Easy to upgrade later

---

## Next Steps

1. **Create backend API** (`/api/submit` endpoint)
2. **Test data flow** from form → backend → Make.com
3. **Set up Make.com webhook** with correct URL
4. **Configure email templates** in Make.com
5. **Set up pro routing** based on geographic region
6. **Build user dashboard** to view submitted forms + quotes
7. **Build pro quote interface** (optional but valuable)

---

## Questions for Owner (Michael)

1. **Do you have a Make.com account?** If so, give us the workspace URL
2. **What's your Cloudinary public ID?** (For organizing photos by lead)
3. **Who should receive admin notifications?** (Daily digest of new leads?)
4. **What geographic regions do you cover?** (For pro assignment routing)
5. **Should pros get automatic assignment or can they find leads themselves?**

---

## Security & Data Considerations

### Privacy
- Never send customer home address to unvetted professionals
- Only include property description and photos
- Customer keeps phone/email control (can refuse contact)

### Compliance
- Terms of Service must mention data sharing with professionals
- Privacy Policy must list Make.com as a data processor
- Unsubscribe link required in every email

### Durability
- Backend stores all data permanently
- Make.com failures don't lose leads (backend has copy)
- Can resend to Make.com if workflow fails

---

**Document created:** 2025-12-03  
**Last updated:** 2025-12-03  
**Status:** Ready for implementation

