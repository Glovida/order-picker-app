// lib/googleSheets.js
import { google } from "googleapis";

let sheetsClient = null;

export async function getGoogleSheetsClient() {
  if (!sheetsClient) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    sheetsClient = google.sheets({ version: "v4", auth });
  }
  
  return sheetsClient;
}

export function columnLetter(colIndex) {
  let letter = "";
  while (colIndex > 0) {
    const mod = (colIndex - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    colIndex = Math.floor((colIndex - mod) / 26);
  }
  return letter;
}