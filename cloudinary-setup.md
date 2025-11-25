# Cloudinary Setup - Step by Step

## Step 1: Create Free Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click **Sign Up Free**
3. Fill in your details and verify email
4. Choose "Developer" when asked about your role

## Step 2: Get Your Cloud Name

1. After login, you'll see the **Dashboard**
2. Find your **Cloud name** (usually at the top)
3. **Copy and save it** - looks like: `your-cloud-name`

## Step 3: Create Upload Preset

1. Go to **Settings** (gear icon) → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name:** `nolaz-store` (or any name you prefer)
   - **Signing Mode:** **Unsigned** (important!)
   - **Folder:** `nolaz-products` (optional, for organization)
   - **Format:** Auto
   - **Quality:** Auto
5. Click **Save**
6. **Copy the preset name** you created

## Step 4: Test Upload (Optional)

1. Go to **Media Library**
2. Click **Upload** → **Upload Image**
3. Select any image file
4. If successful, you'll see the image in your library

## ✅ What You Should Have

- ✅ Cloudinary account created
- ✅ **Cloud name** copied (example: `your-cloud-name`)
- ✅ **Upload preset** created and name copied (example: `nolaz-store`)

## 📝 Save These Values

Write down:
- **Cloud Name:** `_________________`
- **Upload Preset:** `_________________`

**Next:** Update your JavaScript configuration files