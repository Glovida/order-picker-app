// pages/api/updateStatus.js
import { getGoogleSheetsClient, columnLetter } from "../../lib/googleSheets";

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
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // First, get only the headers to determine column indices
    const headersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Orders!1:1",
    });
    
    const headers = headersResponse.data.values?.[0];
    if (!headers) {
      return res.status(500).json({ error: "Headers not found in sheet" });
    }

    const orderNumberIndex = headers.indexOf("Order Number");
    const statusIndex = headers.indexOf("Status");
    if (orderNumberIndex === -1 || statusIndex === -1) {
      return res.status(500).json({ error: "Required headers not found in sheet" });
    }

    // Get only the Order Number column to find matching rows
    const orderNumberColumn = columnLetter(orderNumberIndex + 1);
    const orderNumbersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `Orders!${orderNumberColumn}:${orderNumberColumn}`,
    });
    const orderNumbers = orderNumbersResponse.data.values;
    if (!orderNumbers || orderNumbers.length < 2) {
      return res.status(404).json({ error: "No data found in sheet" });
    }

    let updated = false;
    const statusColumn = columnLetter(statusIndex + 1);
    
    // Loop over the order numbers to find matching ones
    for (let i = 1; i < orderNumbers.length; i++) {
      const rowOrderNumber = String(orderNumbers[i][0] || "").trim();
      if (rowOrderNumber === String(orderNumber).trim()) {
        // Update the status cell for this row
        const statusCell = `${statusColumn}${i + 1}`;

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `Orders!${statusCell}`,
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
