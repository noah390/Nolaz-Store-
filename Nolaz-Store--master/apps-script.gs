/*
 * Google Apps Script for Nolaz Store
 * 
 * Setup Instructions:
 * 1. Create a Google Sheet with these columns in row 1:
 *    id | name | price | description | category | image | status
 * 
 * 2. Open Extensions → Apps Script in your Google Sheet
 * 3. Replace the default code with this script
 * 4. Change SHEET_NAME below to match your sheet name
 * 5. Save the script (Ctrl+S)
 * 6. Deploy as Web App:
 *    - Click Deploy → New Deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click Deploy
 * 7. Copy the Web App URL and use it as APPS_SCRIPT_URL in admin.js
 * 8. Also publish your sheet as CSV:
 *    - File → Share → Publish to web
 *    - Select your sheet and CSV format
 *    - Copy the CSV URL for script.js
 */

const SHEET_NAME = 'Products'; // Change this to your actual sheet name

// Handle POST requests (add, update, delete products)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({status: 'error', error: `Sheet '${SHEET_NAME}' not found`}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Handle different actions
    if (data.action === 'delete') {
      return deleteProduct(sheet, data.id);
    } else if (data.action === 'update') {
      return updateProduct(sheet, data);
    } else {
      return addProduct(sheet, data);
    }
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Add new product
function addProduct(sheet, data) {
  // Validate required fields
  if (!data.name || !data.price) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', error: 'Name and price are required'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Add product to sheet
  const row = [
    data.id || new Date().getTime().toString(),
    data.name || '',
    data.price || '',
    data.description || '',
    data.category || '',
    data.image || '',
    data.status || 'active'
  ];
  
  sheet.appendRow(row);
  
  return ContentService
    .createTextOutput(JSON.stringify({status: 'ok', message: 'Product added successfully'}))
    .setMimeType(ContentService.MimeType.JSON);
}

// Update existing product
function updateProduct(sheet, data) {
  // Validate required fields
  if (!data.name || !data.price || !data.id) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', error: 'ID, name and price are required'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const allData = sheet.getDataRange().getValues();
  
  // Find the row with matching ID
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][0] === data.id) {
      // Update the row
      const row = i + 1;
      sheet.getRange(row, 1, 1, 7).setValues([[
        data.id,
        data.name || '',
        data.price || '',
        data.description || '',
        data.category || '',
        data.image || '',
        data.status || 'active'
      ]]);
      
      return ContentService
        .createTextOutput(JSON.stringify({status: 'ok', message: 'Product updated successfully'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({status: 'error', error: 'Product not found'}))
    .setMimeType(ContentService.MimeType.JSON);
}

// Delete product
function deleteProduct(sheet, productId) {
  if (!productId) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', error: 'Product ID is required'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const allData = sheet.getDataRange().getValues();
  
  // Find the row with matching ID
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][0] === productId) {
      // Delete the row
      sheet.deleteRow(i + 1);
      
      return ContentService
        .createTextOutput(JSON.stringify({status: 'ok', message: 'Product deleted successfully'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({status: 'error', error: 'Product not found'}))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle GET requests (retrieve products)
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({status: 'error', error: `Sheet '${SHEET_NAME}' not found`}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const products = rows.map(row => {
      const product = {};
      headers.forEach((header, index) => {
        product[header] = row[index] || '';
      });
      return product;
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({status: 'ok', products: products}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}



// Test function to verify setup
function testSetup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    Logger.log(`ERROR: Sheet '${SHEET_NAME}' not found`);
    return false;
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const expectedHeaders = ['id', 'name', 'price', 'description', 'category', 'image', 'status'];
  
  Logger.log('Current headers:', headers);
  Logger.log('Expected headers:', expectedHeaders);
  
  const hasAllHeaders = expectedHeaders.every(header => 
    headers.some(h => h.toString().toLowerCase() === header.toLowerCase())
  );
  
  if (hasAllHeaders) {
    Logger.log('✅ Setup is correct!');
    return true;
  } else {
    Logger.log('❌ Missing headers. Please add the required column headers.');
    return false;
  }
}