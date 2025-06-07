// pages/api/updateStatus.js
import { google } from "googleapis";

// Enable caching for production
export const dynamic = 'force-static';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderNumber } = req.body;
  if (!orderNumber) {
    return res.status(400).json({ error: "Missing orderNumber" });
  }

  try {
    // Set up Google Sheets API authentication using your service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // Replace literal "\n" with actual newlines
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Fetch all data to locate rows to update
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Orders!A:Z",
    });
    const rows = getResponse.data.values;
    if (!rows || rows.length < 2) {
      return res.status(404).json({ error: "No data found in sheet" });
    }

    // Determine the column indices for Order Number and Status
    const headers = rows[0];
    const orderNumberIndex = headers.indexOf("Order Number");
    const statusIndex = headers.indexOf("Status");
    if (orderNumberIndex === -1 || statusIndex === -1) {
      return res
        .status(500)
        .json({ error: "Required headers not found in sheet" });
    }

    let updated = false;
    // Loop over the data rows to find matching order numbers
    for (let i = 1; i < rows.length; i++) {
      const rowOrderNumber = String(rows[i][orderNumberIndex]).trim();
      if (rowOrderNumber === String(orderNumber).trim()) {
        // Determine the cell to update (row i+1, and convert column index to letter)
        const cell = `${columnLetter(statusIndex + 1)}${i + 1}`;

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `Orders!${cell}`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [["done"]],
          },
        });
        updated = true;
      }
    }

    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating sheet:", error);
    return res.status(500).json({ error: error.message });
  }
}

// Helper function to convert a 1-indexed column number to its letter (e.g., 1 -> A, 2 -> B)
function columnLetter(colIndex) {
  let letter = "";
  while (colIndex > 0) {
    const mod = (colIndex - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    colIndex = Math.floor((colIndex - mod) / 26);
  }
  return letter;
}
