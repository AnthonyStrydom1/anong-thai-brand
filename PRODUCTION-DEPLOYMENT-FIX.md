# 🔧 PRODUCTION DEPLOYMENT FIX
# Environment Variables for https://www.anongthaibrand.com/

## 🚨 CRITICAL: Update Production Environment Variables

Your live website at https://www.anongthaibrand.com/ is experiencing API authentication failures because it's still using the OLD Supabase credentials that were rotated for security.

### ✅ Required Production Environment Variables:

**Frontend (VITE_ prefixed for build-time injection):**
```
VITE_SUPABASE_URL=https://nyadgiutmweuyxqetfuh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWRnaXV0bXdldXl4cWV0ZnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyOTA3MjQsImV4cCI6MjA2NDg2NjcyNH0.2A1-OfpJiAxIGWxa4PdBtnFNDwBuV3X38fB21AWo88A
VITE_ENVIRONMENT=production
VITE_CSRF_SECRET=anong-thai-production-csrf-secret-2025
```

**Backend (if you have backend services):**
```
SUPABASE_URL=https://nyadgiutmweuyxqetfuh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWRnaXV0bXdldXl4cWV0ZnVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTI5MDcyNCwiZXhwIjoyMDY0ODY2NzI0fQ.h_dL1DeYQyd6EVM0hnCeaCK1NDzdMqeN-asszEgkYMs
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWRnaXV0bXdldXl4cWV0ZnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyOTA3MjQsImV4cCI6MjA2NDg2NjcyNH0.2A1-OfpJiAxIGWxa4PdBtnFNDwBuV3X38fB21AWo88A
NODE_ENV=production
PORT=5000
```

## 🛠️ How to Update (Platform-Specific):

### If using Lovable:
1. Go to https://lovable.dev/projects/eb1728d7-5956-4202-b13a-3eccdae7e450
2. Click "Settings" → "Environment Variables"
3. Add the variables above
4. Redeploy/Publish the project

### If using Vercel:
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add the VITE_ prefixed variables
5. Redeploy

### If using Netlify:
1. Go to your Netlify dashboard
2. Select your site
3. Go to "Site settings" → "Environment variables"
4. Add the VITE_ prefixed variables
5. Redeploy

### If using custom hosting:
1. Update your deployment configuration
2. Set environment variables in your hosting platform
3. Rebuild and redeploy

## 🔍 Verification:

After updating, these errors should disappear:
- ❌ "Invalid API key" errors
- ❌ Currency selector disabled
- ❌ "Error loading next event"
- ❌ PayFast credentials not loading

And these should work:
- ✅ Currency selector active
- ✅ Event loading
- ✅ All API calls authenticated
- ✅ Full functionality restored

## 📅 Updated: June 18, 2025
## 🔐 Security Status: Credentials rotated and secured