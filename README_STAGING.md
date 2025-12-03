# EstateQuoter Staging Workflow

## Overview

This document describes how development happens on EstateQuoter and how changes flow from staging to production.

### Branches

- **`main`** – Production code. Always deployable, always live at estatequoter.com
- **`staging`** – Development code. Deployed to staging environment for testing before production

### Deployment Flow

```
Developer commits to staging
    ↓
GitHub Actions CI runs tests
    ↓
Auto-deploys to staging site (staging.estatequoter.com)
    ↓
Manual testing & approval
    ↓
Create Pull Request: staging → main
    ↓
Code review + approval required
    ↓
Merge to main
    ↓
GitHub Actions auto-deploys to production (estatequoter.com)
```

## How to Test Before Production

### 1. Push Changes to Staging Branch

```bash
cd /home/workspace/estatequoter
git add .
git commit -m "Add new feature or fix"
git push origin staging
```

### 2. Staging Site Auto-Updates

Within 2-3 minutes:
- GitHub Actions workflow runs
- Staging site updates at: `https://staging.estatequoter.com/`

### 3. Test Everything

- [ ] Form submission works end-to-end
- [ ] Backend endpoints respond correctly
- [ ] Data persists to database
- [ ] Make.com webhooks fire
- [ ] User receives confirmation email
- [ ] Pro dashboard displays correctly
- [ ] No console errors in browser
- [ ] Mobile responsiveness OK

### 4. If Tests Pass

Create a Pull Request from `staging` to `main`:

```bash
git log staging..main  # See what's different
# Then go to GitHub and create the PR
```

Add description of changes, request review if needed, then merge.

### 5. If Tests Fail

Make fixes on staging:

```bash
git add .
git commit -m "Fix: specific issue"
git push origin staging
# Re-test at staging.estatequoter.com
```

Keep iterating until everything works.

## CI/CD Setup

### GitHub Actions Workflow: `.github/workflows/deploy.yml`

- **Trigger:** Push to `staging` or `main`
- **Steps:**
  1. Checkout code
  2. Install dependencies
  3. Run tests
  4. Build frontend/backend
  5. Deploy to appropriate environment
  
### Environment Configuration

- **Staging:** `VITE_API_URL=https://api-staging.estatequoter.com`
- **Production:** `VITE_API_URL=https://api.estatequoter.com`

## Important Rules

✅ **DO:**
- Commit frequently to `staging`
- Test thoroughly on staging before merging to main
- Write descriptive commit messages
- Create PRs with context about what changed

❌ **DON'T:**
- Direct commits to `main` (should be blocked)
- Merge to main without testing on staging
- Leave broken code on staging
- Commit secrets or API keys (use environment variables)

## Making Your First Change

1. Checkout staging: `git checkout staging`
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes
4. Push to GitHub: `git push origin feature/your-feature`
5. Create PR: `feature/your-feature` → `staging`
6. Once merged to staging, test at staging site
7. When ready, create PR: `staging` → `main`
8. Merge to main once approved

## Reverting Changes

### If staging is broken:

```bash
git log staging
git revert <commit-hash>
git push origin staging
```

### If main is broken:

Contact ops immediately to rollback production deployment.

---

**Questions?** Check the contributing guidelines or ask the team.

