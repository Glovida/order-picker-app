// pages/api/updateBarcode.js

import { google } from "googleapis";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID_TWO; // Use your second spreadsheet ID
const SHEET_NAME = "Sheet1"; // Change if your target sheet has a different name

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sku, barcode } = req.body;
  if (!sku || !barcode) {
    return res.status(400).json({ error: "Missing sku or barcode" });
  }

  try {
    // Set up Google Sheets API authentication using your service account details
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // Replace literal "\n" with actual newlines if necessary
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Retrieve the sheet data (assumes SKU is in column A and barcode is to be updated in column D)
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:D`,
    });
    const rows = getResponse.data.values;
    if (!rows || rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No data found in the spreadsheet" });
    }

    // Assume the first row contains headers.
    // Search for the matching SKU in column A (first column)
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (
        String(rows[i][0]).trim().toLowerCase() ===
        String(sku).trim().toLowerCase()
      ) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) {
      return res.status(404).json({ error: "SKU not found" });
    }

    // Determine the cell to update. If the barcode is in column D, then the cell is D{rowIndex+1}
    const cellRange = `${SHEET_NAME}!D${rowIndex + 1}`; // Sheets rows are 1-indexed

    // Update the barcode cell
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: cellRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[barcode]],
      },
    });

    return res.status(200).json({ success: true, message: "Barcode updated" });
  } catch (error) {
    console.error("Error updating barcode:", error);
    return res.status(500).json({ error: error.message });
  }
}
