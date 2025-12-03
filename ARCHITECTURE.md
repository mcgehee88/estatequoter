# EstateQuoter Platform Architecture

## System Overview

```
┌─────────────────┐
│   Frontend      │
│  (Static HTML)  │
└────────┬────────┘
         │
         │ POST /api/submit
         │ POST /api/pro/quote
         │ GET /api/leads/:id
         │
         v
┌──────────────────────────────────────┐
│  Backend (Hono + Bun)                │
│  - Form submissions                  │
│  - Data validation                   │
│  - Database I/O                      │
│  - Auth (magic links)                │
│  - Pro routing                       │
└────────┬────────────────────────────┬┘
         │                            │
         │ (1) Save to DB             │ (2) Webhook to Make.com
         v                            v
    ┌────────┐               ┌────────────────┐
    │Database│               │  Make.com      │
    │(SQLite)│               │  - Email       │
    └────────┘               │  - Logging     │
                             │  - CRM         │
                             └────────────────┘
         │
         │ Pro responses
         v
    ┌─────────────┐
    │  Quotes DB  │
    │  - Stored   │
    │  - Tracked  │
    └─────────────┘
```

## Technology Stack

### Frontend
- **HTML/CSS/JS** – Static files, no build step
- **Cloudinary** – Direct image/video upload
- **Browser storage** – Client-side form state

### Backend
- **Hono.js** – Lightweight web framework
- **Bun** – JavaScript runtime (already available)
- **SQLite** – Local database (simple, no setup)
- **Node.js** – Compatible with Hono

### Infrastructure
- **Zo Computer** – Hosts backend API service
- **Make.com** – Email routing & webhooks
- **Cloudinary** – Media storage

---

## Data Schema

### 1. Professionals (Pros)

```sql
CREATE TABLE pros (
  id TEXT PRIMARY KEY,              -- slug-based ID: "caring-transitions-vb"
  slug TEXT UNIQUE NOT NULL,        -- URL-safe: caring-transitions-vb
  company_name TEXT NOT NULL,       -- "Caring Transitions of Chesapeake"
  contact_name TEXT NOT NULL,       -- "Todd Osborne"
  email TEXT NOT NULL,              -- Routing email
  phone TEXT NOT NULL,              -- Phone number
  service_area TEXT NOT NULL,       -- "Virginia Beach, VA"
  region_code TEXT,                 -- "va-coast" (for routing)
  
  services_offered TEXT,            -- JSON: ["Estate sale", "Cleanout", ...]
  
  logo_url TEXT,                    -- Cloudinary URL
  website TEXT,
  bio TEXT,
  
  -- Pricing/Rules
  base_fee_min INT,                 -- $0 - $1000
  base_fee_max INT,
  commission_percent INT,           -- 20-40%
  minimum_estate_value INT,         -- Only accept estates > $X
  
  -- Status
  active BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT false,
  created_at DATETIME,
  updated_at DATETIME,
  
  -- Stats
  leads_received INT DEFAULT 0,
  quotes_submitted INT DEFAULT 0,
  response_rate_percent INT,
  avg_response_time_hours INT
);
```

### 2. Leads / Submissions

```sql
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,              -- "sub_1733230415_abc123"
  slug TEXT UNIQUE,                 -- "pro-link-slug" if from Pro, NULL if from main site
  pro_id TEXT,                      -- Foreign key to pros table, NULL if from main site
  
  -- Customer Info
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  
  -- Property Details
  property_type TEXT,               -- "House", "Condo", "Commercial"
  property_sqft INT,
  property_beds INT,
  property_baths INT,
  property_extra_rooms TEXT,        -- JSON: ["Attic", "Basement"]
  property_fullness_level INT,      -- 1-5 scale
  
  -- Services Needed
  services_needed TEXT,             -- JSON: ["Estate sale", "Cleanout"]
  high_value_items TEXT,            -- JSON: ["Antiques", "Jewelry"]
  oversized_items TEXT,             -- JSON: ["Piano", "Pool table"]
  clearout_preference TEXT,         -- "Full clear-out", "Selective"
  
  -- Timeline & Context
  timeline TEXT,                    -- "Urgent (1-2 weeks)", "Flexible"
  access TEXT,                      -- "Easy ground-level", "Stairs required"
  estimated_value INT,              -- $0-$1M+
  estimated_value_reasoning TEXT,
  
  -- Location
  city TEXT,
  state TEXT,
  region TEXT,
  zip_code TEXT,
  
  -- Media
  cloudinary_image_urls TEXT,       -- JSON array
  cloudinary_video_urls TEXT,       -- JSON array
  
  -- Metadata
  referral_source TEXT,             -- "organic", "google", "referral", "pro-link"
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  notes TEXT,
  
  -- Status Tracking
  status TEXT DEFAULT 'submitted',  -- "submitted", "sent-to-pros", "quoted", "closed"
  sent_to_pros_at DATETIME,
  completed_at DATETIME,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Quotes / Responses

```sql
CREATE TABLE quotes (
  id TEXT PRIMARY KEY,              -- "quote_1733230500_xyz"
  submission_id TEXT NOT NULL,      -- Foreign key
  pro_id TEXT NOT NULL,             -- Foreign key
  
  -- Quote Details
  quote_amount_min INT,             -- Minimum quote
  quote_amount_max INT,             -- Maximum quote
  quote_type TEXT,                  -- "Flat fee", "Percentage", "Range"
  
  commission_percent INT,           -- If percentage-based
  description TEXT,                 -- Pro's custom notes
  
  -- Pro Response
  can_service BOOLEAN DEFAULT true,
  interested BOOLEAN,
  timeline_realistic BOOLEAN,
  additional_questions TEXT,
  
  -- Contact Info for customer
  pro_contact_name TEXT,
  pro_contact_email TEXT,
  pro_contact_phone TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Magic Links / Auth

```sql
CREATE TABLE magic_links (
  id TEXT PRIMARY KEY,              -- "link_1733230600_abc"
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,       -- Random 32-char hex
  entity_type TEXT,                 -- "submission", "pro"
  entity_id TEXT,                   -- Foreign key
  
  expires_at DATETIME,              -- 24 hours from creation
  redeemed_at DATETIME,             -- NULL until used
  redeemed_from_ip TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Public Endpoints (No auth required)

#### `POST /api/submit`
Submit a new form (from main intake or pro link)

**Request:**
```json
{
  "source": "main|pro",
  "pro_slug": "caring-transitions-vb",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "555-1234",
  "property_type": "House",
  "property_sqft": 2500,
  "property_beds": 3,
  "property_baths": 2,
  "property_fullness_level": 3,
  "services_needed": ["Estate sale", "Cleanout"],
  "timeline": "Flexible (30-90 days)",
  "cloudinary_images": ["https://res.cloudinary.com/.../image.jpg"],
  "city": "Richmond",
  "state": "VA"
}
```

**Response:**
```json
{
  "success": true,
  "submission_id": "sub_1733230415_abc123",
  "message": "Thank you! We've sent your information to local professionals.",
  "dashboard_url": "https://estatequoter.com/dashboard/sub_1733230415_abc123"
}
```

#### `POST /api/pro/onboard`
Create a new professional/pro link

**Request:**
```json
{
  "company_name": "Caring Transitions",
  "contact_name": "Todd Osborne",
  "email": "todd@caring.com",
  "phone": "555-1234",
  "service_area": "Virginia Beach, VA",
  "slug": "caring-transitions-vb"
}
```

**Response:**
```json
{
  "success": true,
  "pro_id": "pro_caring_vb",
  "pro_slug": "caring-transitions-vb",
  "pro_link": "https://estatequoter.com/?pro=caring-transitions-vb",
  "magic_link": "https://estatequoter.com/pro/dashboard/[token]"
}
```

#### `GET /api/submission/:id/details`
Get a submission (with magic link auth)

**Query params:**
- `token` – Magic link token (for public access)

**Response:**
```json
{
  "submission": {
    "id": "sub_1733230415_abc123",
    "customer_name": "John Doe",
    "property_type": "House",
    "city": "Richmond",
    "state": "VA",
    "services_needed": ["Estate sale"],
    "cloudinary_images": ["https://res.cloudinary.com/.../image.jpg"],
    "created_at": "2025-12-03T15:10:00Z"
  }
}
```

#### `GET /api/submission/:id/quotes`
Get all quotes for a submission

**Response:**
```json
{
  "submission_id": "sub_1733230415_abc123",
  "quotes": [
    {
      "id": "quote_123",
      "pro_name": "Caring Transitions",
      "pro_contact": "555-1234",
      "quote_min": 3000,
      "quote_max": 5000,
      "created_at": "2025-12-04T10:00:00Z"
    }
  ]
}
```

---

### Pro Dashboard Endpoints

#### `GET /pro/dashboard`
Show pro their leads and quotes

**Auth:** Magic link or session

#### `POST /pro/quote`
Submit a quote for a lead

**Request:**
```json
{
  "submission_id": "sub_123",
  "quote_min": 3000,
  "quote_max": 5000,
  "can_service": true,
  "notes": "Can do this next week"
}
```

---

### Admin Endpoints

#### `GET /admin/submissions`
List all submissions (with filters)

**Query params:**
- `status` – "submitted", "sent-to-pros", "quoted"
- `from_date` – ISO date
- `to_date` – ISO date
- `limit` – Default 50

#### `GET /admin/submissions/export`
Export to CSV

---

## File Storage & Database

### Backend Directory Structure

```
/home/workspace/estatequoter/
├── api/
│   ├── index.ts              # Hono server entry point
│   ├── routes/
│   │   ├── submissions.ts    # POST /api/submit
│   │   ├── pro.ts            # Pro onboarding + dashboard
│   │   ├── auth.ts           # Magic links
│   │   └── admin.ts          # Admin endpoints
│   ├── db/
│   │   ├── schema.ts         # SQLite schema
│   │   ├── queries.ts        # Common queries
│   │   └── init.ts           # DB setup
│   ├── services/
│   │   ├── make-webhook.ts   # Call Make.com
│   │   ├── email.ts          # Email templates
│   │   ├── routing.ts        # Pro assignment logic
│   │   └── cloudinary.ts     # Cloudinary helpers
│   └── middleware/
│       ├── auth.ts           # Magic link validation
│       └── validation.ts     # Input validation
├── data/                      # SQLite database files
│   ├── estatequoter.db
│   └── estatequoter-staging.db
├── package.json
├── tsconfig.json
└── bun.lock
```

### Database Storage

**SQLite** – Simple, reliable, no external dependencies

- Development: `/home/workspace/estatequoter/data/estatequoter-dev.db`
- Staging: `/home/workspace/estatequoter/data/estatequoter-staging.db`
- Production: `/home/workspace/estatequoter/data/estatequoter.db` (on Zo server)

### Backups

- Daily automatic backups to `/home/workspace/estatequoter/backups/`
- Before major deployments, snapshot the database
- Can restore from 7-day rolling backup

---

## Deployment & Environments

### Development (Your Machine)

```bash
bun run dev
# Backend runs at http://localhost:3000
# Frontend at http://localhost:3000
```

### Staging (Vercel/Netlify)

- Auto-deploys on push to `staging` branch
- URL: `https://staging.estatequoter.com`
- Database: `estatequoter-staging.db`
- Make.com webhook: `https://hook.make.com/staging`

### Production (Vercel/Netlify)

- Deploys on merge to `main` branch
- URL: `https://estatequoter.com`
- Database: `estatequoter.db`
- Make.com webhook: `https://hook.make.com/production`

---

## Security & Auth

### Magic Link Flow (No Password Required)

1. User enters email on form/dashboard
2. Backend generates random 32-char token
3. Email sent with link: `estatequoter.com/dashboard?token=xyz`
4. Token valid for 24 hours
5. One-time use only
6. Stored in database for validation

### Session Management

- After token redeemed, create short-lived session (2 hours)
- Session cookie is HTTP-only, secure
- Can be extended if user stays active

### API Keys & Secrets

**Never commit:**
- Make.com webhook URL
- Cloudinary API key
- Email credentials

**Store in `.env` (not committed):**
```
MAKE_WEBHOOK_URL=https://hook.make.com/xxx
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
SENDGRID_API_KEY=xxx
```

---

## Monitoring & Logging

### What to Track

- Form submissions per day
- Submission → pro email latency
- Quote response rate
- Failed Make.com webhooks
- Database query performance

### Log Output

- All API requests logged to stdout
- Searchable via Loki (already running on Zo)
- Queries and timestamps for debugging

---

## Performance Targets

- Form submission → database save: < 100ms
- Database save → Make.com webhook: < 500ms
- End-to-end (form to pro email): < 5 seconds
- API response time: < 200ms
- Database: 1000s of records/month easily handled

---

## Next Steps

1. ✅ Create staging branch
2. ✅ Document architecture
3. ⬜ Create database schema & init script
4. ⬜ Build backend API (Hono)
5. ⬜ Connect frontend form submission
6. ⬜ Set up Make.com webhook
7. ⬜ Build pro dashboard
8. ⬜ Build admin dashboard
9. ⬜ Test end-to-end
10. ⬜ Deploy to staging
11. ⬜ Create PR to main

---

**Created:** 2025-12-03  
**Status:** Ready for implementation  
**Owner:** Michael McGehee

