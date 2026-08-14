/**
 * StayNJoy Google Sheet KYC & Guest Record Webhook
 * Supports multiple photo links in a single cell (e.g. Aadhaar Front, Back, Receipt)
 * 
 * Instructions to deploy:
 * 1. Open your Google Sheet
 * 2. Click 'Extensions' > 'Apps Script'
 * 3. Delete any code there, paste this entire file, and click Save (disk icon).
 * 4. Click 'Deploy' (top right) > 'New deployment' (or Manage deployments > edit > New version)
 * 5. Select type: 'Web app'
 *    - Description: 'StayNJoy Multi-Photo Webhook'
 *    - Execute as: 'Me' (your email)
 *    - Who has access: 'Anyone'
 * 6. Click 'Deploy', authorize permissions, and copy the 'Web app URL'.
 */

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var payload = JSON.parse(rawData);
    
    var data = payload.data || payload;
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // If sheet is empty, auto-write headers
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
    
    var preUrlRaw = data.preBookingScreenshot || "";
    var postUrlRaw = data.postBookingScreenshot || "";

    // Append base row first
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
      "", // Will format with clickable links
      ""  // Will format with clickable links
    ]);

    var lastRow = sheet.getLastRow();

    // Format single or multiple links in Column J (Pre-Booking) & Column K (Post-Booking)
    formatMultiLinkCell(sheet.getRange(lastRow, 10), preUrlRaw, "Pre-Booking");
    formatMultiLinkCell(sheet.getRange(lastRow, 11), postUrlRaw, "Post-Booking");

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Row added successfully with photo links", row: lastRow })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Formats 1 or multiple URLs in a single cell with individual clickable links
 */
function formatMultiLinkCell(cellRange, rawText, labelPrefix) {
  if (!rawText) return;
  
  var urls = String(rawText).split(/[\n,]+/).map(function(u) { return u.trim(); }).filter(Boolean);
  if (urls.length === 0) return;
  
  if (urls.length === 1) {
    cellRange.setFormula('=HYPERLINK("' + urls[0] + '", "' + labelPrefix + ' Photo")');
    cellRange.setFontColor("#1155cc").setFontLine("underline");
    return;
  }
  
  // Multiple links in single cell: e.g. "Pre-Booking 1 | Pre-Booking 2 | Pre-Booking 3"
  var richTextBuilder = SpreadsheetApp.newRichTextValue();
  var textParts = [];
  var linksInfo = [];
  
  for (var i = 0; i < urls.length; i++) {
    var label = labelPrefix + " " + (i + 1);
    var start = textParts.join(" | ").length + (textParts.length > 0 ? 3 : 0);
    var end = start + label.length;
    textParts.push(label);
    linksInfo.push({ start: start, end: end, url: urls[i] });
  }
  
  var fullText = textParts.join(" | ");
  richTextBuilder.setText(fullText);
  
  for (var j = 0; j < linksInfo.length; j++) {
    var linkStyle = SpreadsheetApp.newTextStyle()
      .setForegroundColor("#1155cc")
      .setUnderline(true)
      .build();
    richTextBuilder.setTextStyle(linksInfo[j].start, linksInfo[j].end, linkStyle);
    richTextBuilder.setLinkUrl(linksInfo[j].start, linksInfo[j].end, linksInfo[j].url);
  }
  
  cellRange.setRichTextValue(richTextBuilder.build());
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "online", message: "StayNJoy Google Sheet Webhook is active." })
  ).setMimeType(ContentService.MimeType.JSON);
}
