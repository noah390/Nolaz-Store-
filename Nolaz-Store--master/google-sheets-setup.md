# Google Sheets Setup - Step by Step

## Step 1: Create Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click "Blank" to create new spreadsheet
3. Rename it to "Nolaz Store Products"

## Step 2: Add Column Headers

In row 1, add these exact headers (copy and paste):

```
id	name	price	description	category	image	status
```

**Important:** Make sure these are in columns A through G:
- A1: id
- B1: name  
- C1: price
- D1: description
- E1: category
- F1: image
- G1: status

## Step 3: Add Sample Data (Optional)

Add this sample product in row 2 to test:

```
1001	Sample T-Shirt	2500	Comfortable cotton t-shirt	Clothing		active
```

## Step 4: Publish as CSV

1. Click **File** → **Share** → **Publish to web**
2. In the dialog:
   - Link tab: Select your sheet name (usually "Sheet1")
   - Format: Choose **"Comma-separated values (.csv)"**
3. Click **Publish**
4. Copy the CSV URL (it looks like this):
   ```
   https://docs.google.com/spreadsheets/d/1ABC123.../pub?output=csv
   ```
5. **Save this URL** - you'll need it for configuration

## ✅ Verification

Your sheet should look like this:

| id   | name           | price | description              | category | image | status |
|------|----------------|-------|--------------------------|----------|-------|--------|
| 1001 | Sample T-Shirt | 2500  | Comfortable cotton t-shirt| Clothing |       | active |

**Next:** Set up Google Apps Script