/**
 * StayNJoy Google Sheet KYC & Guest Record Webhook
 * 
 * Instructions to deploy:
 * 1. Open your Google Sheet
 * 2. Click 'Extensions' > 'Apps Script'
 * 3. Delete any code there, paste this entire file, and click Save (disk icon).
 * 4. Click 'Deploy' (top right) > 'New deployment'
 * 5. Select type: 'Web app'
 *    - Description: 'StayNJoy Sync Webhook'
 *    - Execute as: 'Me' (your email)
 *    - Who has access: 'Anyone'
 * 6. Click 'Deploy', authorize permissions, and copy the 'Web app URL'.
 * 7. Paste that Web App URL in your StayNJoy Admin Panel under "Sheet KYC Sync" > "Webhook Settings" (or into .env as SHEETS_WEBAPP_URL).
 */

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var payload = JSON.parse(rawData);
    
    // Support either direct data object or payload.data
    var data = payload.data || payload;
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // If sheet is totally empty, write headers automatically
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Date",
        "Guest Name",
        "Room No.",
        "Address",
        "Parent's Name",
        "Phone No.",
        "Cash",
        "Online",
        "Notes",
        "Pre-Booking Screenshot",
        "Post-Booking Screenshot"
      ]);
      sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#f3f3f3");
    }

    var date = data.date || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy");
    var guestName = data.guestName || "";
    var roomNo = data.roomNo || "";
    var address = data.address || "";
    var parentName = data.parentName || "";
    var phone = data.phone ? "'" + data.phone : "";
    var cash = data.cash || "";
    var online = data.online || "";
    var notes = data.notes || "";
    
    // Format image URLs as clickable hyperlinks if present
    var preUrl = data.preBookingScreenshot || "";
    var preCell = preUrl ? '=HYPERLINK("' + preUrl + '", "View Pre-Booking Photo")' : "";
    
    var postUrl = data.postBookingScreenshot || "";
    var postCell = postUrl ? '=HYPERLINK("' + postUrl + '", "View Post-Booking Photo")' : "";

    // Append the row
    sheet.appendRow([
      date,
      guestName,
      roomNo,
      address,
      parentName,
      phone,
      cash,
      online,
      notes,
      preCell || preUrl,
      postCell || postUrl
    ]);

    var lastRow = sheet.getLastRow();

    // Format hyperlinks blue and underlined
    if (preCell) {
      sheet.getRange(lastRow, 10).setFontColor("#1155cc").setFontLine("underline");
    }
    if (postCell) {
      sheet.getRange(lastRow, 11).setFontColor("#1155cc").setFontLine("underline");
    }

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Row added successfully", row: lastRow })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "online", message: "StayNJoy Google Sheet Webhook is ready." })
  ).setMimeType(ContentService.MimeType.JSON);
}
