# Setup Guide for Branch Deployment System

## 🚀 Quick Setup Checklist

- [ ] Configure Google Cloud Platform
- [ ] Set up Firebase service account
- [ ] Add GitHub secrets
- [ ] Test deployment locally
- [ ] Create test PR

## 🔧 Google Cloud Platform Setup

### 1. Create Service Account
```bash
# Create service account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions Deployment"

# Grant necessary permissions
gcloud projects add-iam-policy-binding lauriecrean-free-38256 \
    --member="serviceAccount:github-actions@lauriecrean-free-38256.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding lauriecrean-free-38256 \
    --member="serviceAccount:github-actions@lauriecrean-free-38256.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding lauriecrean-free-38256 \
    --member="serviceAccount:github-actions@lauriecrean-free-38256.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
```

### 2. Create Service Account Key
```bash
# Generate JSON key
gcloud iam service-accounts keys create github-actions-key.json \
    --iam-account=github-actions@lauriecrean-free-38256.iam.gserviceaccount.com
```

### 3. Enable Required APIs
```bash
# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Enable Container Registry API
gcloud services enable containerregistry.googleapis.com
```

## 🔥 Firebase Setup

### 1. Generate Service Account
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `lauriecrean-free-38256`
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Save the JSON file

### 2. Enable Hosting API
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting (if not already done)
firebase init hosting
```

## 🔐 GitHub Secrets Configuration

Go to your GitHub repository → Settings → Secrets and Variables → Actions

### Add Repository Secrets:

1. **GCP_PROJECT_ID**
   ```
   lauriecrean-free-38256
   ```

2. **GCP_SA_KEY**
   ```
   {
     "type": "service_account",
     "project_id": "lauriecrean-free-38256",
     ...
   }
   ```
   *(Paste the entire JSON content from the service account key file)*

3. **FIREBASE_SERVICE_ACCOUNT_LAURIECREAN_FREE_38256**
   ```
   {
     "type": "service_account",
     "project_id": "lauriecrean-free-38256",
     ...
   }
   ```
   *(Paste the entire JSON content from the Firebase service account)*

## 🧪 Testing Setup

### 1. Test API Locally
```bash
cd apps/api/github
npm install
npm run build
npm start

# Test health endpoint
curl http://localhost:8080/health
```

### 2. Test Web App Locally
```bash
cd apps/web
npm install
npm run build
npm run serve

# Test in browser
open http://localhost:3000
```

### 3. Test Docker Build
```bash
cd apps/api/github
docker build -t api-github-test .
docker run -p 8080:8080 api-github-test

# Test health endpoint
curl http://localhost:8080/health
```

## 🔍 Verification Steps

### 1. Check API Health Endpoint
Your API must have a `/health` endpoint that returns a 200 status:

```javascript
// apps/api/github/src/index.ts
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});
```

### 2. Check Firebase Configuration
Verify `apps/web/firebase.json` contains:
```json
{
  "hosting": {
    "site": "lauriecrean-free-38256",
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```

### 3. Check Dockerfile
Verify `apps/api/github/Dockerfile` exposes port 8080:
```dockerfile
EXPOSE 8080
ENV PORT=8080
```

## 🎯 Create Test PR

1. Create a new branch:
   ```bash
   git checkout -b test-deployment
   ```

2. Make a small change:
   ```bash
   echo "# Test deployment" >> apps/web/README.md
   ```

3. Push and create PR:
   ```bash
   git add .
   git commit -m "test: trigger deployment"
   git push origin test-deployment
   ```

4. Create pull request on GitHub

5. Watch the Actions tab for deployment progress

## 🔄 Expected Results

After creating the PR, you should see:
1. GitHub Actions workflow starts
2. API deploys to Cloud Run with branch-specific URL
3. Web app deploys to Firebase with branch-specific channel
4. Integration tests run
5. PR comment appears with deployment URLs

## 🚨 Common Issues

### API Deployment Fails
- Check service account permissions
- Verify Docker builds locally
- Ensure health endpoint exists

### Web Deployment Fails
- Check Firebase service account permissions
- Verify build succeeds locally
- Check Firebase project settings

### Integration Tests Fail
- Verify CORS configuration in API
- Check health endpoint response format
- Ensure both services are publicly accessible

## 📞 Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Review the workflow files
3. Test components locally first
4. Verify all secrets are configured correctly 