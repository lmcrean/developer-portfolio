# Deploy Tasks API to Cloud Run

## Quick Deploy Steps

### Option 1: Manual Docker Build (Recommended)

```bash
# 1. Build from monorepo root
docker build -f Dockerfile.api -t gcr.io/dottie-app-37930/api-github:latest .

# 2. Push to Google Container Registry
docker push gcr.io/dottie-app-37930/api-github:latest

# 3. Deploy to Cloud Run with env vars
gcloud run deploy api-gh-actions \
  --image gcr.io/dottie-app-37930/api-github:latest \
  --region europe-west2 \
  --set-env-vars="NEONDB_KEY=psql 'postgresql://neondb_owner:npg_DU5gpAmZVxb4@ep-little-hall-abkslt8a-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'" \
  --allow-unauthenticated
```

### Option 2: Use Existing CI/CD

If you have GitHub Actions or another CI/CD pipeline, add these steps:

1. **Build Context**: Make sure builds run from monorepo root
2. **Environment Variable**: Add `NEONDB_KEY` to Cloud Run service

### Option 3: Just Add Env Var to Existing Service

If you want to test with the current deployment first:

```bash
# This will update the existing service with just the env var
# (Won't work until you deploy the new code with tasks routes)
gcloud run services update api-gh-actions \
  --region europe-west2 \
  --set-env-vars="NEONDB_KEY=psql 'postgresql://neondb_owner:npg_DU5gpAmZVxb4@ep-little-hall-abkslt8a-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'"
```

## Verify Deployment

After deployment, test the endpoints:

```bash
# Get your Cloud Run URL
SERVICE_URL=$(gcloud run services describe api-gh-actions --region europe-west2 --format='value(status.url)')

# Test health endpoint
curl $SERVICE_URL/health

# Test tasks endpoint
curl $SERVICE_URL/api/tasks/labels/templates

# Create a test label
curl -X POST $SERVICE_URL/api/tasks/labels/templates \
  -H "Content-Type: application/json" \
  -d '{"text":"Production Test","color":"#00FF00"}'
```

## Troubleshooting

### If build fails:
- Check that you're in the monorepo root when running docker build
- Verify `apps/db` and `apps/api/github` both exist
- Check Docker has enough memory allocated

### If deployment fails:
- Check Cloud Run logs: https://console.cloud.google.com/run
- Verify the NEONDB_KEY is set correctly
- Ensure the service has the correct permissions

### If API doesn't work:
- Check the database connection in Cloud Run logs
- Verify the Neon database accepts connections from Cloud Run IPs
- Test the `/health` endpoint first

## Environment Variables

Current required env vars for the service:
- `PORT` - Set by Cloud Run automatically (8080)
- `NODE_ENV` - Should be "production"
- `GITHUB_TOKEN` - Your existing GitHub API token
- `NEONDB_KEY` - **NEW** Database connection string

## Files Changed

- ✅ `Dockerfile.api` - New Dockerfile for monorepo build
- ✅ `apps/api/github/src/routes/tasks.ts` - Tasks API routes
- ✅ `apps/api/github/src/index.ts` - Registers tasks routes
- ✅ `apps/db/` - Entire database package
