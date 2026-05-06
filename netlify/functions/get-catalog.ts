import type { Handler } from '@netlify/functions';
import { getSheetsClient, SHEET_ID } from './_sheets';

type ProductCategory = 'Jersey' | 'Trinket' | 'Cap' | 'Pants' | 'Practice' | 'Patch';

interface Product {
  sku: string;
  category: ProductCategory;
  teamId: string | null;
  displayName: string;
  description: string;
  basePrice: number | null;
  sizesAvailable: string[];
  imageUrl: string;
  available: boolean;
  displayOrder: number;
}

const VALID_CATEGORIES: ProductCategory[] = ['Jersey', 'Trinket', 'Cap', 'Pants', 'Practice', 'Patch'];

function toCategory(raw: string): ProductCategory {
  return VALID_CATEGORIES.includes(raw as ProductCategory) ? (raw as ProductCategory) : 'Jersey';
}

export const handler: Handler = async () => {
  try {
    const sheets = getSheetsClient();
    // Headers are in row 4; data starts at row 5. Column K (Notes) is included in range
    // but stripped before returning.
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Catalog!A5:K',
    });

    const rows = res.data.values ?? [];
    const products: Product[] = rows
      .filter((row) => row[0]) // skip rows with empty SKU
      .map((row): Product => ({
        sku: String(row[0] ?? ''),
        category: toCategory(String(row[1] ?? '')),
        teamId: row[2] ? String(row[2]) : null,
        displayName: String(row[3] ?? ''),
        description: String(row[4] ?? ''),
        basePrice: row[5] !== '' && row[5] != null ? Number(row[5]) : null,
        sizesAvailable: row[6] ? String(row[6]).split(',').map((s) => s.trim()).filter(Boolean) : [],
        imageUrl: String(row[7] ?? ''),
        available: String(row[8]).toUpperCase() === 'TRUE',
        displayOrder: row[9] != null && row[9] !== '' ? Number(row[9]) : 9999,
        // row[10] is Notes — intentionally not mapped
      }))
      .filter((p) => p.available) // server-side filter: never send unavailable products to client
      .sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
        return a.displayName.localeCompare(b.displayName);
      });

    // Strip the `available` boolean before sending — it's always true by this point
    // and exposing it leaks internal filtering logic to the client.
    const clientProducts = products.map(({ available: _available, ...p }) => p);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientProducts),
    };
  } catch (err) {
    console.error('get-catalog error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Could not fetch catalog' }),
    };
  }
};
