/**
 * StayNJoy Google Sheet KYC & Guest Record Webhook
 * 
 * Supports:
 * - 3 Branch Tabs: 'Chaliha Nagar', 'Lake Bordoloi Nagar', 'IT office Bordoloi Nagar'
 * - Multi-photo links in a single cell
 * - Smart insertion directly into Table rows
 */

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var payload = JSON.parse(rawData);
    var action = payload.action;
    var data = payload.data || payload;
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ==========================================
    // ACTION: DELETE BOOKING
    // ==========================================
    if (action === "deleteBooking") {
      var targetId = payload.bookingId;
      if (!targetId) throw new Error("No bookingId provided for deletion.");
      
      var tabsToSearch = ["Chaliha Nagar", "Lake Bordoloi Nagar", "IT office Bordoloi Nagar"];
      var deleted = false;
      
      for (var t = 0; t < tabsToSearch.length; t++) {
        var sh = ss.getSheetByName(tabsToSearch[t]);
        if (!sh) continue;
        
        var values = sh.getDataRange().getValues();
        // Search Column L (index 11) for the bookingId
        for (var r = 0; r < values.length; r++) {
          if (values[r][11] === targetId) {
            sh.deleteRow(r + 1); // 1-indexed
            deleted = true;
            break;
          }
        }
        if (deleted) break;
      }
      
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, message: deleted ? "Row deleted" : "Row not found" })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // ==========================================
    // ACTION: ADD GUEST RECORD
    // ==========================================
    // 1. Pick the correct sheet tab based on location
    var location = (data.location || "").toLowerCase();
    var sheet = null;
    
    if (location.indexOf("chaliha") !== -1) {
      sheet = ss.getSheetByName("Chaliha Nagar");
    } else if (location.indexOf("lake") !== -1) {
      sheet = ss.getSheetByName("Lake Bordoloi Nagar");
    } else if (location.indexOf("it") !== -1 || location.indexOf("income") !== -1) {
      sheet = ss.getSheetByName("IT office Bordoloi Nagar");
    }
    
    // Fallback if not found by exact name
    if (!sheet) {
      sheet = ss.getSheetByName("Chaliha Nagar") || ss.getActiveSheet();
    }

    var date = data.date || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd-MM-yyyy");
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
    var bookingId = data.bookingId || ""; // Get bookingId to save it

    // 2. Find the first empty row in this tab (checking Date or Guest Name)
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    var targetRow = values.length + 1;

    for (var r = 1; r < values.length; r++) {
      var rowDate = values[r][0];
      var rowName = values[r][1];
      if ((rowDate === "" || rowDate === null || rowDate === undefined) && 
          (rowName === "" || rowName === null || rowName === undefined)) {
        targetRow = r + 1; // 1-indexed row number
        break;
      }
    }

    // 3. Write data into the row (Now adding bookingId to Column L / index 11)
    var rowValues = [
      [date, guestName, roomNo, address, parentName, phone, cash, online, notes, "", "", bookingId]
    ];
    sheet.getRange(targetRow, 1, 1, 12).setValues(rowValues);

    // 4. Format single or multiple links in Column J (Pre-Booking) & Column K (Post-Booking)
    formatMultiLinkCell(sheet.getRange(targetRow, 10), preUrlRaw, "Pre-Booking");
    formatMultiLinkCell(sheet.getRange(targetRow, 11), postUrlRaw, "Post-Booking");

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Successfully synced to sheet",
        tab: sheet.getName(),
        row: targetRow
      })
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
  
  // Multiple links in single cell: "Pre-Booking 1 | Pre-Booking 2 | Pre-Booking 3"
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
    JSON.stringify({ status: "online", message: "StayNJoy Multi-Location Webhook is active." })
  ).setMimeType(ContentService.MimeType.JSON);
}
