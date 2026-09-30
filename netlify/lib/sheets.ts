import { google } from 'googleapis';

export function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

export const SHEET_ID = process.env.GOOGLE_SHEETS_ID ?? '';

/**
 * Neutralizes spreadsheet formula injection by prefixing a single quote to any
 * value that a spreadsheet client would treat as a formula.
 *
 * The Sheets API calls here all use valueInputOption: 'RAW', so these values are
 * already stored literally and never evaluate inside Google Sheets. The real risk
 * is downstream: exporting a tab to CSV and opening it in Excel or LibreOffice,
 * which *do* parse a leading = + - @ as a formula. Apply to every user-supplied
 * string written to a sheet.
 */
export const safecell = (s: string) => (/^[=+\-@\t\r]/.test(s) ? "'" + s : s);

/**
 * Append rows to a tab. Always RAW (values stored literally) and INSERT_ROWS:
 * append writes just below the table it *detects*, and with the default
 * OVERWRITE a Sheets "Table" that covers only the header made that row 2, so
 * every submission replaced the last (incident 2026-09-30).
 */
export async function appendRows(range: string, rows: string[][]): Promise<void> {
  await getSheetsClient().spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: rows },
  });
}
