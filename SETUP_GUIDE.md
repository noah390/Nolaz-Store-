# Nolaz Store Setup Guide

## Overview
Your Nolaz Store is now a fully functional e-commerce website that uses Google Sheets as a database and includes an admin panel for managing products. Here's how to set it up:

## 🚀 Quick Setup Checklist

### 1. Google Sheets Setup
1. **Create a new Google Sheet**
   - Go to [sheets.google.com](https://sheets.google.com)
   - Create a new spreadsheet
   - Name it "Nolaz Store Products" (or any name you prefer)

2. **Add column headers in row 1:**
   ```
   id | name | price | description | category | image | status
   ```

3. **Publish as CSV:**
   - Go to File → Share → Publish to web
   - Select your sheet and choose "Comma-separated values (.csv)"
   - Click "Publish"
   - Copy the CSV URL (looks like: `https://docs.google.com/spreadsheets/d/SHEET_ID/pub?output=csv`)

### 2. Google Apps Script Setup
1. **Open Apps Script:**
   - In your Google Sheet, go to Extensions → Apps Script
   - Delete the default code and paste the content from `apps-script.gs`
   - Change `SHEET_NAME` to match your sheet name (default: 'Sheet1')

2. **Deploy as Web App:**
   - Click Deploy → New Deployment
   - Choose type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Click Deploy
   - Copy the Web App URL

### 3. Cloudinary Setup (for image hosting)
1. **Create free account:**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for free account

2. **Get your credentials:**
   - Go to Dashboard
   - Note your Cloud Name
   - Go to Settings → Upload → Add upload preset
   - Create an unsigned upload preset
   - Note the preset name

### 4. Configure Your Store

#### Update `script.js`:
```javascript
const SHEET_CSV_URL = 'YOUR_GOOGLE_SHEETS_CSV_URL';
const WHATSAPP_NUMBER = 'YOUR_WHATSAPP_NUMBER'; // without + sign
```

#### Update `admin.js`:
```javascript
const ADMIN_PASSWORD = 'your_secure_password';
const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
const CLOUDINARY_CLOUD_NAME = 'your_cloudinary_name';
const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset';
const SHEET_CSV_URL = 'YOUR_GOOGLE_SHEETS_CSV_URL'; // same as script.js
```

## 🎨 Features

### Customer Store (`index.html`)
- ✅ Modern, responsive design
- ✅ Product grid with images
- ✅ WhatsApp integration for orders
- ✅ Real-time loading from Google Sheets
- ✅ Mobile-friendly interface

### Admin Panel (`admin.html`)
- ✅ Secure password login
- ✅ Add new products with images
- ✅ View all products in table format
- ✅ Product status management
- ✅ Image upload to Cloudinary
- ✅ Real-time Google Sheets integration

## 📱 How It Works

1. **Customer Experience:**
   - Visits your store website
   - Browses products loaded from Google Sheets
   - Clicks "Order on WhatsApp" to purchase
   - Gets redirected to WhatsApp with pre-filled message

2. **Admin Experience:**
   - Logs into admin panel
   - Adds products with images and details
   - Products automatically appear on main store
   - Can view and manage all products

## 🔧 Configuration Details

### WhatsApp Integration
- Customers click "Order on WhatsApp"
- Pre-filled message includes product name, price, and ID
- Direct connection to your WhatsApp Business

### Google Sheets Database
- All product data stored in Google Sheets
- Real-time synchronization
- Easy to backup and manage
- Can be edited directly in Google Sheets

### Image Hosting
- Images uploaded to Cloudinary (free tier: 25GB)
- Automatic optimization and CDN delivery
- Supports JPG, PNG formats

## 🚨 Security Notes

1. **Change the admin password** in `admin.js`
2. **Keep your Apps Script URL private**
3. **Use HTTPS** when hosting your website
4. **Regular backups** of your Google Sheet

## 📞 Support

### Common Issues:

**Products not loading:**
- Check SHEET_CSV_URL in script.js
- Ensure Google Sheet is published as CSV
- Check browser console for errors

**Admin can't add products:**
- Verify APPS_SCRIPT_URL in admin.js
- Check Google Apps Script deployment settings
- Ensure Cloudinary credentials are correct

**Images not uploading:**
- Check Cloudinary cloud name and upload preset
- Ensure upload preset is "unsigned"
- Check file size (max 10MB recommended)

## 🎯 Next Steps

1. **Customize Design:**
   - Edit `style.css` for your brand colors
   - Update logo in HTML files
   - Add your brand information

2. **Add More Features:**
   - Product categories filter
   - Search functionality
   - Customer reviews
   - Inventory tracking

3. **Deploy Your Store:**
   - Upload files to web hosting service
   - Configure custom domain
   - Set up SSL certificate

## 📊 File Structure
```
Nolaz Store/
├── index.html          # Main store page
├── admin.html          # Admin panel
├── style.css           # All styles
├── script.js           # Main store functionality
├── admin.js            # Admin panel functionality
├── apps-script.gs      # Google Apps Script code
└── SETUP_GUIDE.md      # This guide
```

---

**🎉 Your store is ready! Start by setting up Google Sheets and adding your first product through the admin panel.**

