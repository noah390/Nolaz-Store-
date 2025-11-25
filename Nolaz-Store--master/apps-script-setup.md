# Google Apps Script Setup - Step by Step

## Step 1: Open Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. You'll see a new tab with code editor
3. Delete all the default code in the editor

## Step 2: Add the Script Code

1. Copy ALL the code from your `apps-script.gs` file
2. Paste it into the Apps Script editor
3. Change line 21: `const SHEET_NAME = 'Products';` 
   - Change 'Products' to your actual sheet name (usually 'Sheet1')
   - Example: `const SHEET_NAME = 'Sheet1';`

## Step 3: Save the Script

1. Click the **Save** button (💾) or press Ctrl+S
2. Give your project a name: "Nolaz Store Backend"

## Step 4: Test the Script (Optional)

1. In the function dropdown, select `testSetup`
2. Click **Run** ▶️
3. Authorize the script when prompted
4. Check the logs - should show "✅ Setup is correct!"

## Step 5: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Type"
3. Select **Web app**
4. Configure:
   - **Description:** "Nolaz Store API"
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy**
6. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/ABC123.../exec
   ```
7. **Save this URL** - you'll need it for admin configuration

## Step 6: Test the Deployment

1. Open the Web App URL in a new tab
2. You should see JSON response like:
   ```json
   {"status":"ok","products":[...]}
   ```

## ✅ What You Should Have

- ✅ Apps Script project saved
- ✅ Web App deployed and accessible
- ✅ Web App URL copied and saved

**Next:** Set up Cloudinary for image hosting