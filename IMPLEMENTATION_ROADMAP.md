# EstateQuoter Implementation Roadmap

## Phase 1: Foundation (Week 1)

### Goal
Get form submissions flowing end-to-end from frontend → backend → Make.com

### Tasks

#### 1.1 Backend Setup
- [ ] Create `/api` directory structure (Hono + Bun)
- [ ] Initialize `package.json` with dependencies:
  ```json
  {
    "dependencies": {
      "hono": "^4.x",
      "better-sqlite3": "^9.x"
    }
  }
  ```
- [ ] Create `api/index.ts` – Hono server entry point
- [ ] Set up CORS for frontend requests
- [ ] Create `.env` file (not committed):
  ```
  MAKE_WEBHOOK_URL=https://hook.make.com/your-webhook-id
  CORS_ORIGIN=https://estatequoter.com
  NODE_ENV=staging
  ```

#### 1.2 Database Setup
- [ ] Create SQLite schema file (`api/db/schema.ts`)
- [ ] Write initialization script (`api/db/init.ts`)
- [ ] Create database file: `/data/estatequoter-staging.db`
- [ ] Test schema creation

#### 1.3 API Implementation
- [ ] Create `POST /api/submit` endpoint
  - Validate form data
  - Save to `submissions` table
  - Generate unique `submission_id`
  - Call Make.com webhook
  - Return success response
- [ ] Create `GET /api/submission/:id` endpoint (with magic token)
- [ ] Add error handling + logging

#### 1.4 Frontend Form Update
- [ ] Modify `index.html` form submission handler
- [ ] Instead of nowhere, POST to `/api/submit`
- [ ] Show loading state while submitting
- [ ] Handle success response
- [ ] Show confirmation page with tracking link

#### 1.5 Testing
- [ ] Test form submission locally
- [ ] Verify data saved to database
- [ ] Check Make.com receives webhook
- [ ] Test magic link access
- [ ] Verify error handling

**Deliverables:**
- ✅ Git PR with all Phase 1 code
- ✅ `/API_FLOW.md` documenting exact request/response format
- ✅ Test results showing end-to-end flow working
- ✅ Database file with sample data

**Expected Timeline:** 2-3 days

---

## Phase 2: Pro System (Week 2)

### Goal
Create pro onboarding flow, pro link system, and pro dashboard MVP

### Tasks

#### 2.1 Pro Onboarding
- [ ] Create `POST /api/pro/onboard` endpoint
  - Validate company name, email, etc.
  - Check slug uniqueness
  - Generate magic link
  - Send onboarding email
  - Create row in `pros` table
- [ ] Update `pro.html` modal to actually submit
- [ ] Create pro confirmation email template

#### 2.2 Pro Dashboard (MVP)
- [ ] Create `GET /pro/dashboard` page
  - Show pro their assigned leads
  - Show leads waiting for quote
  - Show leads they've already quoted
- [ ] Create `POST /api/pro/quote` endpoint
  - Accept quote submission
  - Save to `quotes` table
  - Notify customer
- [ ] Add magic link auth for pro access

#### 2.3 Pro Routing Logic
- [ ] Implement geographic matching
  - When submission comes in, find pros in same region
  - Send to up to 5 matching pros
- [ ] Create `api/services/routing.ts`
- [ ] Test with sample data

#### 2.4 Pro Link Subdomain
- [ ] Implement `/?pro=slug` query routing
- [ ] When customer visits with pro slug, mark submission with that pro
- [ ] Save pro_id on submission record

#### 2.5 Testing
- [ ] Test pro onboarding flow
- [ ] Submit form as customer from pro link
- [ ] Verify pro sees it on their dashboard
- [ ] Pro submits quote
- [ ] Customer sees quote

**Deliverables:**
- ✅ Git PR with all Phase 2 code
- ✅ Pro dashboard functional (read-only first)
- ✅ Test results showing pro flow working
- ✅ Pro onboarding tested end-to-end

**Expected Timeline:** 3-4 days

---

## Phase 3: Customer Dashboard (Week 3)

### Goal
Allow customers to view their submissions and all received quotes

### Tasks

#### 3.1 Customer Dashboard Page
- [ ] Create `/dashboard/:id` page (HTML/CSS)
- [ ] Parse magic link token from URL
- [ ] Validate token with backend
- [ ] Display submission summary
  - Property details
  - Services needed
  - Timeline
  - Submitted date
- [ ] Display customer's media (Cloudinary images)

#### 3.2 Quotes List
- [ ] Fetch all quotes for submission
- [ ] Display quote cards:
  - Pro company name
  - Quote range (min-max)
  - Pro's notes
  - Contact info (phone/email)
  - Date received
- [ ] Show "Waiting for more quotes" state

#### 3.3 Email Link
- [ ] When form submitted, send customer email
  - Summary of what we got
  - Link to dashboard
  - Estimated timeline for quotes
- [ ] Magic link works for 24 hours
- [ ] Can resend link if needed

#### 3.4 Testing
- [ ] Submit form
- [ ] Receive email
- [ ] Click link
- [ ] See dashboard
- [ ] See quotes appear (as pro submits them)

**Deliverables:**
- ✅ Git PR with dashboard code
- ✅ Email template tested
- ✅ Magic link validated
- ✅ Full customer flow tested

**Expected Timeline:** 2-3 days

---

## Phase 4: Admin Dashboard (Week 4)

### Goal
Internal admin tools for monitoring and managing the platform

### Tasks

#### 4.1 Admin Endpoints
- [ ] Create `GET /admin/submissions` (list all)
- [ ] Add filters: status, date range, value, city
- [ ] Create `GET /admin/submissions/export` (CSV)
- [ ] Create `GET /admin/pros` (list all)
- [ ] Create `GET /admin/stats` (summary metrics)

#### 4.2 Admin UI
- [ ] Build admin dashboard page
- [ ] Submissions table with filters
- [ ] Professionals list
- [ ] Quick stats
- [ ] Export buttons

#### 4.3 Admin Auth
- [ ] Simple password login (or use GitHub OAuth)
- [ ] Session management
- [ ] Restrict access to /admin routes

#### 4.4 Testing
- [ ] Login works
- [ ] Can view all submissions
- [ ] Filters work
- [ ] CSV export contains correct data
- [ ] Cannot access without auth

**Deliverables:**
- ✅ Git PR with admin code
- ✅ Admin dashboard functional
- ✅ Export working
- ✅ Auth verified

**Expected Timeline:** 2-3 days

---

## Phase 5: Production Prep & Optimization (Week 5)

### Goal
Prepare everything for production deployment with proper error handling, monitoring, and performance optimization

### Tasks

#### 5.1 Error Handling
- [ ] Add try-catch to all endpoints
- [ ] Return proper HTTP status codes
- [ ] Log all errors with context
- [ ] User-friendly error messages

#### 5.2 Monitoring & Logging
- [ ] Set up structured logging (JSON format)
- [ ] Log all form submissions
- [ ] Log all API calls (method, endpoint, response time)
- [ ] Alert on high error rates

#### 5.3 Security Audit
- [ ] Validate all inputs (no SQL injection)
- [ ] Sanitize outputs (no XSS)
- [ ] Rate limiting on /api/submit (prevent spam)
- [ ] HTTPS everywhere
- [ ] API keys in environment variables only

#### 5.4 Performance Optimization
- [ ] Database indexes on frequently queried fields
- [ ] Cache pro list (revalidate every 1 hour)
- [ ] Cache region data
- [ ] Optimize queries (no N+1)

#### 5.5 Documentation
- [ ] Update README with full setup instructions
- [ ] Document all API endpoints
- [ ] Create DEPLOYMENT.md with prod checklist
- [ ] Document environment variables needed

#### 5.6 Testing
- [ ] Load test (1000 submissions/day)
- [ ] Security testing
- [ ] Database backup/restore test
- [ ] Failover scenarios

**Deliverables:**
- ✅ Git PR with all optimizations
- ✅ Security audit checklist completed
- ✅ Load test results
- ✅ Updated documentation

**Expected Timeline:** 3-4 days

---

## Phase 6: Staging Deployment (Week 5)

### Goal
Deploy staging environment to verify everything works before production

### Tasks

#### 6.1 Staging Infrastructure
- [ ] Create staging domain: `staging.estatequoter.com`
- [ ] Set up staging database
- [ ] Configure staging Make.com webhook
- [ ] Set staging environment variables

#### 6.2 CI/CD Pipeline
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Auto-deploy on push to `staging` branch
- [ ] Auto-deploy on merge to `main` branch
- [ ] Run tests on every push
- [ ] Slack notifications on deploy

#### 6.3 Testing on Staging
- [ ] Full end-to-end test flow
- [ ] Submit form as customer
- [ ] Pro receives lead notification
- [ ] Pro submits quote
- [ ] Customer sees quote on dashboard
- [ ] Admin can view all data
- [ ] Performance acceptable

#### 6.4 Make.com Integration Testing
- [ ] Webhook receives payloads
- [ ] Emails send correctly
- [ ] Data logged to spreadsheet
- [ ] No data loss

**Deliverables:**
- ✅ Staging environment fully functional
- ✅ All tests passing
- ✅ Performance metrics acceptable
- ✅ Ready for production

**Expected Timeline:** 2-3 days

---

## Phase 7: Production Deployment (Week 6)

### Goal
Deploy to production with zero downtime

### Tasks

#### 7.1 Pre-Deployment Checklist
- [ ] Database backup taken
- [ ] Rollback plan documented
- [ ] Team notified of deployment window
- [ ] Support team briefed
- [ ] All PRs reviewed and approved

#### 7.2 Production Deployment
- [ ] Merge `staging` → `main`
- [ ] GitHub Actions auto-deploys
- [ ] Monitor logs for errors
- [ ] Test production URLs
- [ ] Verify Make.com webhooks working

#### 7.3 Post-Deployment
- [ ] Monitor error rates (should be low)
- [ ] Monitor performance (should be fast)
- [ ] Check database for new submissions
- [ ] Verify emails sending
- [ ] Announce to customers

#### 7.4 Monitoring
- [ ] Daily health checks for 1 week
- [ ] Monitor pro response rates
- [ ] Monitor customer satisfaction
- [ ] Fix any issues quickly

**Deliverables:**
- ✅ Production environment live
- ✅ All systems operational
- ✅ Monitoring in place
- ✅ Support ready

**Expected Timeline:** 1 day

---

## Phase 8: Post-Launch Improvements (Ongoing)

### Goal
Gather feedback and iterate on the product

### Tasks (Priority Order)

- [ ] **High:** Phone number formatting (auto-format to xxx-xxx-xxxx)
- [ ] **High:** Better error messages in forms
- [ ] **High:** Analytics on which professionals respond fastest
- [ ] **High:** Bulk operations for admin (mark multiple as closed)
- [ ] **Medium:** Auto-assign based on pro pricing rules
- [ ] **Medium:** Lead expiration (mark old leads as expired)
- [ ] **Medium:** SMS notifications to pro
- [ ] **Medium:** Pro rating/review system
- [ ] **Low:** Mobile app for pros
- [ ] **Low:** CRM integrations (HubSpot, Pipedrive)

---

## Git Workflow

### Creating a PR

```bash
# Branch naming: feature/my-feature or fix/bug-description
git checkout staging
git pull origin staging
git checkout -b feature/customer-dashboard

# Make your changes, test thoroughly
git add .
git commit -m "feat: Add customer dashboard with quote viewing"

# Push and create PR
git push origin feature/customer-dashboard
# Then go to GitHub and create PR: feature/... → staging
```

### Code Review Process

1. Create PR with description of changes
2. At least one person reviews
3. Address feedback
4. Merge to `staging`
5. Test on staging.estatequoter.com
6. Create new PR: `staging` → `main`
7. Final review
8. Merge to main (auto-deploys to production)

### Commit Messages

```
feat: Add customer dashboard
fix: Fix email template formatting
docs: Update API documentation
refactor: Simplify quote calculation logic
test: Add tests for pro routing
```

---

## Risk Mitigation

### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Data loss | Daily backups + manual snapshots before deploys |
| Performance issues | Load testing + database optimization |
| Make.com failures | Backend logs all data before sending |
| Form submission fails | User sees error message + can retry |
| Pro doesn't receive notification | Email logged + can be resent manually |
| Incorrect pro assigned | Geographic matching tested thoroughly |

---

## Success Metrics

- [ ] 100% form submission success rate
- [ ] < 2 second end-to-end response time
- [ ] Make.com webhook success rate > 99%
- [ ] Pro response rate > 70%
- [ ] Zero data loss
- [ ] < 0.1% error rate on API calls

---

## Timeline Summary

- **Week 1:** Backend foundation + form submission
- **Week 2:** Pro system + onboarding
- **Week 3:** Customer dashboard
- **Week 4:** Admin dashboard
- **Week 5:** Production prep + staging deployment
- **Week 6:** Production deployment
- **Ongoing:** Improvements & monitoring

**Total:** ~6 weeks to full production launch

---

## Questions Before Starting?

1. **Do you have a Make.com webhook URL?** If not, I can set up a temporary one for testing
2. **What's your Cloudinary cloud name?** (For organizing media)
3. **Email:** What email should system use for sending? (Can use your Gmail + Make.com)
4. **Admin auth:** Password or GitHub OAuth?
5. **Pro pricing tiers:** Do you want $49/$149/$199/mo pricing for future upgrades?

---

**Created:** 2025-12-03  
**Status:** Ready to begin implementation  
**Owner:** Michael McGehee + Zo

