# Deployment Guide

## 🚀 Deploy to GitHub Pages

### Step 1: Push to GitHub

```bash
# Navigate to your project folder
cd "c:\Users\TECH MARYLAND\Desktop\Nolaz  Store"

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Nolaz Store e-commerce website"

# Add remote repository
git remote add origin https://github.com/noah390/Nolaz-Store-.git

# Push to GitHub
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository: https://github.com/noah390/Nolaz-Store-
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**

### Step 3: Access Your Live Site

Your site will be available at:
**https://noah390.github.io/Nolaz-Store-/home.html**

## 🔧 Configuration After Deployment

### 1. Google Sheets Setup
- Create Google Sheet with required columns
- Publish as CSV
- Update `SHEET_CSV_URL` in:
  - `script.js`
  - `home.js`
  - `admin.js`

### 2. Google Apps Script
- Deploy the Apps Script as web app
- Update `APPS_SCRIPT_URL` in `admin.js`

### 3. Cloudinary (Optional)
- Set up Cloudinary account
- Update credentials in `admin.js`

### 4. WhatsApp Number
- Update phone number in all JavaScript files

## 📝 Quick Commands

```bash
# Clone repository
git clone https://github.com/noah390/Nolaz-Store-.git

# Make changes and push updates
git add .
git commit -m "Update: description of changes"
git push origin main
```

## 🌐 Custom Domain (Optional)

1. Add `CNAME` file with your domain
2. Configure DNS settings
3. Enable HTTPS in GitHub Pages settings

## ✅ Deployment Checklist

- [ ] Repository created and files pushed
- [ ] GitHub Pages enabled
- [ ] Google Sheets configured
- [ ] Apps Script deployed
- [ ] WhatsApp number updated
- [ ] Site tested and working
- [ ] Custom domain configured (optional)

---

**Live Site**: https://noah390.github.io/Nolaz-Store-/home.html