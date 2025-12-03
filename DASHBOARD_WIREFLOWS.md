# EstateQuoter Dashboard Wireflows

## 1. Customer Dashboard

### Purpose
Allow customers who submitted a form to view their submission details and all quotes received from professionals.

### Entry Points
- Magic link email: "Track your quotes"
- Direct URL: `estatequoter.com/dashboard/[submission_id]?token=[magic_link_token]`

### Flow

#### Step 1: Email Entry
```
Customer submits form
    ↓
Receives email: "We got your submission!"
    ↓
Clicks "View your quotes" link
    ↓
Redirected to: estatequoter.com/dashboard/sub_123?token=abc123xyz
```

#### Step 2: Dashboard View

**Header:**
- EstateQuoter logo
- "Your Estate Quote Requests"
- Submission date: "Submitted on Dec 3, 2025"

**Submission Summary Section:**
```
┌─────────────────────────────────────┐
│  Your Property Summary              │
├─────────────────────────────────────┤
│ • 3-bed, 2-bath house               │
│ • 2,500 sq ft                       │
│ • Richmond, VA                      │
│ • Estimated value: $400,000         │
│ • You need: Estate sale & Cleanout  │
│ • Timeline: Flexible (30-90 days)   │
│                                     │
│ [View full submission details]      │
└─────────────────────────────────────┘
```

**Photos/Media Section:**
```
┌─────────────────────────────────────┐
│  Photos & Videos You Provided       │
├─────────────────────────────────────┤
│  [Image 1] [Image 2] [Image 3]      │
│  [Video 1]                          │
│                                     │
│  3 photos, 1 video                  │
└─────────────────────────────────────┘
```

**Quotes Section:**
```
┌─────────────────────────────────────┐
│  Quotes Received (2)                │
├─────────────────────────────────────┤
│                                     │
│ ✅ Caring Transitions               │
│    Quote range: $3,500 - $5,000     │
│    Can start: Next week             │
│    "We specialize in estates like   │
│     yours. Can handle the piano."   │
│                                     │
│    [Call: 555-1234] [Email]        │
│                                     │
│ ✅ Elite Estate Sales               │
│    Quote range: $2,800 - $4,200     │
│    Can start: ASAP                  │
│    "Full service estate sale team"  │
│                                     │
│    [Call: 555-5678] [Email]        │
│                                     │
│ ⏳ Waiting on 3 more quotes...      │
│    Some pros typically respond      │
│    within 24-48 hours.              │
│                                     │
└─────────────────────────────────────┘
```

**Call-to-Action:**
- "Questions?" button → Support email
- "Update your info" → Can change email/phone
- "Report issue" → Flag spam/wrong data

---

## 2. Pro Dashboard

### Purpose
Show professionals their assigned leads and allow them to quickly submit quotes.

### Entry Points
- Magic link email: "New lead waiting for quote"
- Pro dashboard login: `estatequoter.com/pro/dashboard`
- Direct URL: `estatequoter.com/pro/dashboard?token=[magic_link]`

### Flow

#### Step 1: Pro Onboarding (First Time)

```
Pro goes to estatequoter.com/pro
    ↓
Clicks "Get Your Free Pro Link"
    ↓
Modal appears: "Claim your free link"
    ↓
Fills out form:
  - Company name
  - Your name
  - Email
  - Phone
  - Service area
  - Preferred slug (their-business-name)
    ↓
Clicks "Create my free link"
    ↓
Success screen:
  - "Your link is ready!"
  - Shows: estatequoter.com/?pro=their-business-name
  - Shows upgrade options ($49/mo - $199/mo)
    ↓
Can close or upgrade
```

#### Step 2: Pro Dashboard View

**Header:**
```
┌─────────────────────────────────────┐
│ EstateQuoter Pro Dashboard          │
│ Caring Transitions of Chesapeake    │
│ [Settings] [Logout]                 │
└─────────────────────────────────────┘
```

**Stats Bar:**
```
┌─────────────────────────────────────┐
│ Leads: 12  Quotes: 7  Conversion: 58%
└─────────────────────────────────────┘
```

**Active Leads Section:**
```
┌─────────────────────────────────────┐
│ New Leads Waiting for Quote (3)     │
├─────────────────────────────────────┤
│                                     │
│ 1. Richmond, VA – 3bed estate      │
│    Est. value: $400,000             │
│    Needs: Estate sale + cleanout    │
│    Submitted: Today, 2:45pm         │
│    [View details] [Send quote]      │
│                                     │
│ 2. Falls Church, VA – Downsizing   │
│    Est. value: $150,000             │
│    Needs: Auction help              │
│    Submitted: Today, 1:30pm         │
│    [View details] [Send quote]      │
│                                     │
│ 3. Charlottesville, VA – Cleanout  │
│    Est. value: $75,000              │
│    Needs: Full cleanout             │
│    Submitted: Yesterday, 10:20am    │
│    [View details] [Send quote]      │
│                                     │
└─────────────────────────────────────┘
```

**Quoted Leads Section:**
```
┌─────────────────────────────────────┐
│ Leads You've Quoted (7)             │
├─────────────────────────────────────┤
│                                     │
│ Richmond estate (Dec 3)             │
│  Your quote: $3,500 - $5,000        │
│  Status: Waiting for response       │
│  [Edit quote] [Withdraw]            │
│                                     │
│ Williamsburg cleanup (Dec 2)        │
│  Your quote: $2,100 flat            │
│  Status: They chose competitor      │
│                                     │
│ ... more                            │
│                                     │
└─────────────────────────────────────┘
```

#### Step 3: Pro Views Lead Details

```
Pro clicks [View details] on a lead
    ↓
Modal/page opens showing:
  - Property details (type, size, condition)
  - Customer timeline needs
  - Photos/videos customer uploaded
  - Services requested
  - High-value items mentioned
    ↓
Pro has two options:
  1. [Submit quote]
  2. [Pass on this lead]
```

#### Step 4: Pro Submits Quote

```
Pro clicks [Submit quote]
    ↓
Form opens:
  - Quote min: $____
  - Quote max: $____
  - Or: Flat fee: $____
  - Your notes: (text area)
  - Can you service? Yes/No
  - Estimated timeline? 
  - Any questions for customer?
    ↓
Pro clicks "Send quote"
    ↓
Success: "Quote sent!"
  - Customer gets notified
  - Quote appears on their dashboard
  - Pro dashboard updated
```

---

## 3. Admin Dashboard

### Purpose
Internal tool for EstateQuoter team to monitor platform health, view submissions, manage pros, and export data.

### Entry Points
- Admin-only URL: `estatequoter.com/admin`
- Requires admin login (password or API key)

### Flow

#### Admin Home Screen

```
┌─────────────────────────────────────┐
│ EstateQuoter Admin                  │
│ [Submissions] [Pros] [Quotes]       │
│ [Reports] [Settings]                │
└─────────────────────────────────────┘
```

**Dashboard Stats:**
```
┌─────────────────────────────────────────────────────┐
│  This Week                                          │
│  • 23 submissions received                          │
│  • 5 new professionals                              │
│  • 18 quotes submitted (78% response rate)          │
│  • $2.4M estimated value in pipeline                │
└─────────────────────────────────────────────────────┘
```

#### Submissions View

**List/Table:**
```
┌──────────────────────────────────────────────────────┐
│ Submissions                                          │
│ [Sort] [Filter] [Export CSV]                        │
├──────────────────────────────────────────────────────┤
│ ID    │ Customer  │ City      │ Value   │ Status    │
│────────────────────────────────────────────────────── │
│ sub_1 │ John Doe  │ Richmond  │ $400k   │ Quoted    │
│ sub_2 │ Jane Smith│ Falls Ch. │ $150k   │ Sent      │
│ sub_3 │ Bob Jones │ C'ville   │ $75k    │ Submitted │
│       │           │           │         │           │
└──────────────────────────────────────────────────────┘
```

**Filters:**
- Status: Submitted / Sent-to-pros / Quoted / Closed
- Date range
- Min/max value
- City/region
- Service type

**Actions:**
- [View full details]
- [Resend to pros]
- [Mark closed]
- [View quotes received]

#### Professionals View

```
┌──────────────────────────────────────────────────────┐
│ Professionals                                        │
│ [Add new] [Export list]                             │
├──────────────────────────────────────────────────────┤
│ Company     │ Region    │ Status  │ Leads │ Quotes │
├──────────────────────────────────────────────────────┤
│ Caring Tx   │ VA Coast  │ Active  │ 12    │ 7      │
│ Elite Sales │ Central   │ Active  │ 8     │ 6      │
│ Pro Move    │ VA Coast  │ Pending │ 0     │ 0      │
│             │           │         │       │        │
└──────────────────────────────────────────────────────┘
```

**Actions per pro:**
- [View profile]
- [Edit info]
- [Deactivate]
- [View leads sent]
- [View quotes]

#### Reports

```
┌──────────────────────────────────────┐
│ Reports                              │
├──────────────────────────────────────┤
│                                      │
│ • Daily digest (email)               │
│ • Weekly summary                     │
│ • Revenue tracking                   │
│ • Pro performance                    │
│ • Lead funnel analysis               │
│ • Geographic heatmap                 │
│                                      │
└──────────────────────────────────────┘
```

---

## UI Patterns

### State Indicators

```
Submitted     ○ Gray
Sent to pros  ⟳ Yellow (in progress)
Quoted        ✓ Green (quote received)
Closed        ✓ Blue (deal closed)
Expired       ✗ Red (no response)
```

### Loading States

When fetching data:
```
[Skeleton loading] → 2-3 placeholder blocks
Actual data loads in: < 1 second
```

### Empty States

When no quotes yet:
```
┌────────────────────────────────┐
│ No quotes yet                  │
│                                │
│ Local professionals are        │
│ reviewing your request.        │
│ First quote typically arrives  │
│ within 24 hours.               │
│                                │
│ [Refresh] [Back to form]       │
└────────────────────────────────┘
```

### Error Handling

```
API call fails
    ↓
Show friendly message:
  "Couldn't load. Please refresh."
    ↓
Retry button always available
    ↓
Error logged for debugging
```

---

## Mobile Responsiveness

### Customer Dashboard (Mobile)
- Full-width cards
- Stack vertically
- Touch-friendly buttons (56px min)
- Simplified typography
- Can still see all content without scrolling too much

### Pro Dashboard (Mobile)
- Simplified lead list view
- Tap to expand details
- Quote form optimized for mobile
- One button per action (no side-by-side)

### Admin Dashboard
- Desktop-first (okay if not perfect on mobile)
- Table scrolling on small screens
- Export/filter buttons accessible

---

## Accessibility

- All buttons: Keyboard accessible (Tab)
- Links: Underlined or visually distinct
- Form fields: Labeled (no placeholder-only)
- Colors: Not the only indicator (use icons + text)
- Contrast: WCAG AA minimum
- Mobile: Touch targets 44px+

---

## Interaction Details

### Animations

- Page transitions: Fade in (150ms)
- Quote submitted: Success checkmark animation
- Modal open/close: Smooth 200ms

### Hover States

- Links: Color change or underline
- Buttons: Slight shadow or background darken
- Cards: Subtle shadow increase

---

## Future Enhancements

- [ ] Pro account settings (logo, branding, pricing rules)
- [ ] Email digest for pros (daily leads)
- [ ] Bulk quote actions
- [ ] Lead assignment algorithm improvements
- [ ] Rating/review system
- [ ] CRM integration
- [ ] SMS notifications
- [ ] Push notifications

---

**Created:** 2025-12-03  
**Last updated:** 2025-12-03  
**Status:** Ready for UI/UX implementation

