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
      
      var sheetsToSearch = ss.getSheets();
      var deleted = false;
      
      for (var t = 0; t < sheetsToSearch.length; t++) {
        var sh = sheetsToSearch[t];
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
    var location = (data.location || "").toLowerCase();
    var sheet = null;
    var sheets = ss.getSheets();
    
    // Fuzzy match tab names to prevent trailing space errors
    for (var i = 0; i < sheets.length; i++) {
      var sName = sheets[i].getName().toLowerCase();
      if (location.indexOf("chaliha") !== -1 && sName.indexOf("chaliha") !== -1) {
        sheet = sheets[i]; break;
      }
      if (location.indexOf("lake") !== -1 && sName.indexOf("lake") !== -1) {
        sheet = sheets[i]; break;
      }
      if ((location.indexOf("it") !== -1 || location.indexOf("income") !== -1) && 
          (sName.indexOf("it") !== -1 || sName.indexOf("income") !== -1)) {
        sheet = sheets[i]; break;
      }
    }
    
    // Fallback if not found by exact name
    if (!sheet) {
      sheet = ss.getActiveSheet(); // Just use the active sheet as a last resort
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

    // 3. Write data into the row
    var rowValues = [
      [date, guestName, roomNo, address, parentName, phone, cash, online, notes, "", "", bookingId]
    ];
    var targetRange = sheet.getRange(targetRow, 1, 1, 12);
    targetRange.setValues(rowValues);
    
    // Force text color to black for columns A-I to prevent ugly auto-formatting inheritance
    sheet.getRange(targetRow, 1, 1, 9).setFontColor("#000000").setFontLine("none");

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
  
  // Multiple links in single cell (stacked vertically)
  var richTextBuilder = SpreadsheetApp.newRichTextValue();
  var textParts = [];
  var linksInfo = [];
  
  for (var i = 0; i < urls.length; i++) {
    var label = labelPrefix + " " + (i + 1);
    var start = textParts.join("\n").length + (textParts.length > 0 ? 1 : 0);
    var end = start + label.length;
    textParts.push(label);
    linksInfo.push({ start: start, end: end, url: urls[i] });
  }
  
  var fullText = textParts.join("\n");
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
  cellRange.setWrap(true); // Force cell to wrap text so \n works vertically
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "online", message: "StayNJoy Multi-Location Webhook is active." })
  ).setMimeType(ContentService.MimeType.JSON);
}
