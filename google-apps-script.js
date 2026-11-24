/**
 * ============================================================================
 * PPA KALUGAMUWA CENTRAL COLLEGE - ANNUAL BLOOD DONATION CAMP 2026
 * Google Apps Script Webhook for GitHub Pages Data Collection
 * Inkspire Prints & Dimension
 * ============================================================================
 * 
 * 2-MINUTE SETUP INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.new) and name it "KCC Blood Donation 2026"
 * 2. In Google Sheets, click "Extensions" > "Apps Script" from the top menu
 * 3. Delete any template code in the editor, and PASTE this entire script
 * 4. Click Save icon (or Ctrl + S)
 * 5. Click the blue "Deploy" button (top-right) > "New deployment"
 * 6. Under "Select type", choose "Web app" (click the gear icon if needed)
 * 7. Fill in the fields:
 *    - Description: "KCC Donor Collection Webhook"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone" (CRITICAL: Allows GitHub Pages to submit donors)
 * 8. Click "Deploy", then "Authorize access" (choose your Google account, click "Advanced" > "Go to KCC Blood Donation (unsafe)")
 * 9. Copy the generated "Web App URL" (starts with https://script.google.com/macros/s/...)
 * 10. Open the Admin Portal (admin.html) > click "Google Sheet Sync" > paste your URL!
 * 
 * Done! Every donor registered on your website will automatically append to your Google Sheet!
 * ============================================================================
 */

const ADMIN_PIN = "kcc2026";
const SHEET_NAME = "Donors";

function setupSheet(sheet) {
  if (sheet.getLastRow() === 0) {
    const headers = [
      "Registered Timestamp (LK)",
      "Pass ID",
      "Full Name",
      "Gender",
      "Age",
      "DOB",
      "Contact Phone",
      "WhatsApp Number",
      "Address / Town",
      "Blood Group",
      "Preferred Slot",
      "Language",
      "Medical Check Status"
    ];
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#8f0e1f"); // KCC Crimson Red
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 36);
  }
}

/**
 * Handle POST request from GitHub Pages registration form
 */
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    setupSheet(sheet);

    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter || {};
    }

    const now = new Date();
    const lkTime = Utilities.formatDate(now, "Asia/Colombo", "yyyy-MM-dd HH:mm:ss");

    // Sequential Pass ID starting from #PPA-KCC-BDC-001
    let passId = data.passId;
    if (!passId || passId === "N/A" || !passId.includes("BDC-")) {
      const nextSeq = Math.max(1, sheet.getLastRow()); // Row 1 is headers
      passId = "#PPA-KCC-BDC-" + Utilities.formatString("%03d", nextSeq);
    }

    sheet.appendRow([
      lkTime,
      passId,
      data.name || "N/A",
      data.gender || "N/A",
      data.age || "N/A",
      data.dob || "N/A",
      "'" + (data.contact || "N/A"), // prefix with ' to preserve leading zero in phone numbers
      "'" + (data.whatsapp || "N/A"),
      data.address || "N/A",
      data.bloodGroup || "Not Sure",
      data.slot || "Morning",
      data.lang || "en",
      "Pending Verification"
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Donor registration recorded in Google Sheet",
      passId: data.passId
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET request from admin.html to fetch registered donors list
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        donors: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const pin = (e && e.parameter && e.parameter.pin) || "";
    if (pin !== ADMIN_PIN) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Unauthorized: Invalid PIN"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        donors: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const donors = [];
    for (let i = rows.length - 1; i >= 1; i--) { // Reverse order so newest is first
      const r = rows[i];
      donors.push({
        registeredAt: r[0],
        passId: r[1],
        name: r[2],
        gender: r[3],
        age: r[4],
        dob: r[5],
        contact: String(r[6]).replace(/^'/, ''),
        whatsapp: String(r[7]).replace(/^'/, ''),
        address: r[8],
        bloodGroup: r[9],
        slot: r[10],
        lang: r[11],
        status: r[12]
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      total: donors.length,
      donors: donors
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
