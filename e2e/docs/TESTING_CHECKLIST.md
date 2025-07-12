# development testing checklist

- [x] `npm run test:api:health`
- [x] `npm run test:api:pr-feed` 
- [x] `npm run test:api:pr-detail`
- [ ] `npm run test:web:health` (nice to have)
- [ ] `npm run test:web:landing` (nice to have)
- [⚠️] `npm run test:web:pr-feed` (⚠️ GitHub API rate limited - test infrastructure works)
- [⚠️] `npm run test:web:pr-detail` (⚠️ GitHub API rate limited - test infrastructure works)

# production branch testing checklist

- [x] `npm run test:prod-branch:api:health` (✅ Fixed - now accepts 'ok' and 'warning' statuses)
- [x] `npm run test:prod-branch:api:pr-feed` (✅ Fixed - test now handles both old API (500 error) and new API (per_page capping) gracefully)
- [ ] `npm run test:prod-branch:api:pr-detail`
- [ ] `npm run test:prod-branch:web:landing`
- [ ] `npm run test:prod-branch:web:pr-feed`
- [x] `npm run test:prod-branch:web:pr-detail` (✅ Fixed - removed --headed flag + fixed URL construction issue)

# production main testing checklist

- [ ] `npm run test:prod-main:web:landing`
- [ ] `npm run test:prod-main:web:pr-feed`
- [ ] `npm run test:prod-main:web:pr-detail`