# 🚀 DEPLOYMENT GUIDE - RIGHTYWAY ASO-OKE

## Prerequisites
- GitHub account
- Vercel account (https://vercel.com)
- Railway account (https://railway.app)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- Cloudinary account (https://cloudinary.com)

---

## PART 1: DATABASE SETUP (MongoDB Atlas)

### Step 1: Create MongoDB Database
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account or log in
3. Click "Create a New Cluster" (Free tier is sufficient)
4. Choose a cloud provider and region (preferably close to Nigeria)
5. Click "Create Cluster" and wait for it to be ready (~5 minutes)

### Step 2: Configure Database Access
1. In your cluster, click "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password (SAVE THESE!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### Step 3: Configure Network Access
1. Click "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for Railway/Vercel)
4. Confirm by clicking "Confirm"

### Step 4: Get Connection String
1. Go back to "Database" tab
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `rightyway-aso-oke`
7. **SAVE THIS CONNECTION STRING** - you'll need it for Railway

---

## PART 2: CLOUDINARY SETUP (Image Storage)

### Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com
2. Sign up for a free account
3. Verify your email

### Step 2: Get API Credentials
1. Go to your Dashboard
2. Find these values:
   - Cloud Name
   - API Key
   - API Secret
3. **SAVE THESE CREDENTIALS** - you'll need them for Railway

---

## PART 3: BACKEND DEPLOYMENT (Railway)

### Step 1: Prepare GitHub Repository
```bash
# In PowerShell, run from project root:
cd backend
git init
git add .
git commit -m "Initial backend commit"

# Create a new GitHub repository called "rightyway-backend"
# Then push:
git remote add origin https://github.com/sweets-stack/rightyway-backend.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Railway
1. Go to https://railway.app and sign in with GitHub
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your "rightyway-backend" repository
5. Railway will auto-detect it as a Node.js project

### Step 3: Configure Environment Variables
1. In your Railway project, click on your service
2. Go to "Variables" tab
3. Add these environment variables (one by one):
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://rightyway-aso-oke:rightyway2025-Secure@rightyway.8lbt3zt.mongodb.net/?appName=Rightyway
JWT_SECRET=vN7tF9wQ3kZp2sLr8mHcYx4JdB0uTqAiE6GoRfW1
CLOUDINARY_CLOUD_NAME=dqapjwt7i
CLOUDINARY_API_KEY=536528646664591
CLOUDINARY_API_SECRET=iuVS7r5emAAeVlsuzRaTeqlrCzs
FRONTEND_URL=https://your-app-name.vercel.app
```

**IMPORTANT:** Replace all placeholder values with your actual credentials!

### Step 4: Get Railway URL
1. After deployment completes, go to "Settings" tab
2. Find "Public Networking" section
3. Click "Generate Domain"
4. **COPY THIS URL** (e.g., `https://rightyway-backend-production.up.railway.app`)
5. You'll need this for the frontend!

### Step 5: Create Admin User
1. In Railway, go to your service
2. Open the deployment logs
3. Wait for the message "✅ MongoDB connected"
4. Use Railway's terminal or use your local terminal:
```bash
# Option A: Using Railway CLI
railway run node scripts/seedAdmin.js

# Option B: Create admin via API after deployment
# You can use Postman or curl to POST to:
# https://your-railway-url.up.railway.app/api/auth/register
# Body: { "username": "admin", "password": "your_secure_password", "email": "admin@example.com" }
```

---

## PART 4: FRONTEND DEPLOYMENT (Vercel)

### Step 1: Update Production Environment
1. Open `.env.production` in your project root
2. Update it with your Railway backend URL:
```
VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
```

### Step 2: Push to GitHub
```bash
# In PowerShell, from project root:
git init
git add .
git commit -m "Initial frontend commit"

# Create a new GitHub repository called "rightyway-frontend"
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/rightyway-frontend.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project"
3. Import your "rightyway-frontend" repository
4. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** ./
   - **Build Command:** npm run build
   - **Output Directory:** dist

### Step 4: Add Environment Variables
1. In Vercel project settings, go to "Environment Variables"
2. Add this variable for **Production**:
```
VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
```

3. Click "Deploy"

### Step 5: Update Backend CORS
1. Go back to Railway
2. Update the `FRONTEND_URL` environment variable
3. Set it to your Vercel URL: `https://your-app-name.vercel.app`
4. Railway will automatically redeploy

---

## PART 5: TESTING & VERIFICATION

### Step 1: Test Backend
Visit: `https://your-railway-url.up.railway.app/api/health`

You should see:
```json
{
  "status": "ok",
  "database": "connected",
  "environment": "production"
}
```

### Step 2: Test Frontend
1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Check that the homepage loads
3. Try navigating to the shop page
4. Go to `/admin` and try logging in

### Step 3: Test Complete Flow
1. Log in to admin panel
2. Add a test product
3. View the product on the shop page
4. Create a test order
5. Check the orders in admin panel

---

## PART 6: POST-DEPLOYMENT

### Update Backend Environment Variable
After Vercel deployment, update Railway's `FRONTEND_URL`:
1. Go to Railway → Your service → Variables
2. Update `FRONTEND_URL` to your Vercel URL
3. Save (Railway will auto-redeploy)

### Custom Domain (Optional)
1. **For Vercel:** Settings → Domains → Add your domain
2. **For Railway:** Settings → Public Networking → Add custom domain

---

## TROUBLESHOOTING

### Backend Issues
- **MongoDB Connection Fails:** Check connection string format and network access
- **Images Not Uploading:** Verify Cloudinary credentials
- **CORS Errors:** Make sure `FRONTEND_URL` in Railway matches your Vercel URL

### Frontend Issues
- **API Calls Fail:** Check `VITE_API_URL` in Vercel environment variables
- **Build Fails:** Run `npm run build` locally to check for errors
- **Pages Not Loading:** Verify `vercel.json` rewrites are configured

### Getting Help
- Railway Logs: Project → Deployments → View Logs
- Vercel Logs: Project → Deployments → Function Logs
- Check browser console for frontend errors

---

## 🎉 SUCCESS CHECKLIST

- [ ] MongoDB Atlas cluster created and configured
- [ ] Cloudinary account set up with credentials
- [ ] Backend deployed to Railway with all environment variables
- [ ] Admin user created in database
- [ ] Frontend deployed to Vercel
- [ ] CORS configured with correct Vercel URL
- [ ] Health check endpoint returning "ok"
- [ ] Can log into admin panel
- [ ] Can create and view products
- [ ] Can create and view orders

---

## MAINTENANCE

### Updating Backend
```bash
cd backend
git add .
git commit -m "Update message"
git push
# Railway will auto-deploy
```

### Updating Frontend
```bash
git add .
git commit -m "Update message"
git push
# Vercel will auto-deploy
```

---

## IMPORTANT SECURITY NOTES

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Use strong passwords** for admin accounts
3. **Rotate JWT_SECRET** regularly in production
4. **Keep MongoDB user password secure**
5. **Don't share Cloudinary credentials**
6. **Enable 2FA** on all accounts (GitHub, Vercel, Railway)

---

## COST BREAKDOWN (Free Tiers)

- **MongoDB Atlas:** Free tier (512MB storage)
- **Cloudinary:** Free tier (25GB storage, 25GB bandwidth/month)
- **Railway:** $5/month credit (usually enough for small apps)
- **Vercel:** Free tier (100GB bandwidth/month)

**Total Monthly Cost:** $0-5 depending on traffic

---

🎊 Your Rightyway Aso-Oke store is now live!
