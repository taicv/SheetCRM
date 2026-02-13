// Google Sheets API client for Cloudflare Workers
// Uses authenticated user's OAuth access token

interface SheetRow {
    [key: string]: string;
}

interface SheetsConfig {
    spreadsheetId: string;
    accessToken: string;
}

class GoogleSheetsClient {
    private config: SheetsConfig;

    constructor(config: SheetsConfig) {
        this.config = config;
    }

    private async fetch(endpoint: string, options?: RequestInit): Promise<Response> {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}${endpoint}`;

        return fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.config.accessToken}`,
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
    }

    // Get all rows from a sheet
    async getRows(sheetName: string): Promise<SheetRow[]> {
        const response = await this.fetch(`/values/${encodeURIComponent(sheetName)}`);

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to get rows: ${error}`);
        }

        const data: { values?: string[][] } = await response.json();
        if (!data.values || data.values.length < 2) {
            return [];
        }

        const [headers, ...rows] = data.values;
        return rows.map(row => {
            const obj: SheetRow = {};
            headers.forEach((header, i) => {
                obj[header] = row[i] || '';
            });
            return obj;
        });
    }

    // Append a new row
    async appendRow(sheetName: string, data: SheetRow): Promise<SheetRow> {
        // First get headers
        const headersResponse = await this.fetch(`/values/${encodeURIComponent(sheetName)}!1:1`);
        const headersData: { values?: string[][] } = await headersResponse.json();
        const headers = headersData.values?.[0] || [];

        if (headers.length === 0) {
            throw new Error('Sheet has no headers');
        }

        // Generate ID if not provided
        if (!data.id) {
            data.id = crypto.randomUUID();
        }

        // Add timestamps
        const now = new Date().toISOString();
        if (!data.created_at) {
            data.created_at = now;
        }
        if (!data.updated_at) {
            data.updated_at = now;
        }

        // Build row values in header order
        const values = headers.map(h => data[h] || '');

        const response = await this.fetch(
            `/values/${encodeURIComponent(sheetName)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
            {
                method: 'POST',
                body: JSON.stringify({ values: [values] }),
            }
        );

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to append row: ${error}`);
        }

        return data;
    }

    // Update a row by ID
    async updateRow(sheetName: string, id: string, data: Partial<SheetRow>): Promise<SheetRow | null> {
        // Get all rows to find the row index
        const allRows = await this.getRows(sheetName);
        const rowIndex = allRows.findIndex(row => row.id === id);

        if (rowIndex === -1) {
            return null;
        }

        // Get headers
        const headersResponse = await this.fetch(`/values/${encodeURIComponent(sheetName)}!1:1`);
        const headersData: { values?: string[][] } = await headersResponse.json();
        const headers = headersData.values?.[0] || [];

        // Merge existing data with updates
        const existingRow = allRows[rowIndex];
        const updatedRow: SheetRow = {
            ...existingRow,
            ...data,
            updated_at: new Date().toISOString(),
        };

        // Build row values
        const values = headers.map(h => updatedRow[h] || '');

        // Row index in sheet (1-based, +1 for header, +1 because array is 0-based)
        const sheetRowIndex = rowIndex + 2;

        const response = await this.fetch(
            `/values/${encodeURIComponent(sheetName)}!A${sheetRowIndex}:${String.fromCharCode(65 + headers.length - 1)}${sheetRowIndex}?valueInputOption=RAW`,
            {
                method: 'PUT',
                body: JSON.stringify({ values: [values] }),
            }
        );

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to update row: ${error}`);
        }

        return updatedRow;
    }

    // Delete a row by ID
    async deleteRow(sheetName: string, id: string): Promise<boolean> {
        // Get all rows
        const allRows = await this.getRows(sheetName);
        const rowIndex = allRows.findIndex(row => row.id === id);

        if (rowIndex === -1) {
            return false;
        }

        // Get sheet ID (different from spreadsheet ID)
        const metaResponse = await this.fetch('');
        const metaData: { sheets?: Array<{ properties: { sheetId: number; title: string } }> } = await metaResponse.json();
        const sheet = metaData.sheets?.find(s => s.properties.title === sheetName);

        if (!sheet) {
            throw new Error(`Sheet "${sheetName}" not found`);
        }

        // Delete row using batchUpdate
        const sheetRowIndex = rowIndex + 1; // 0-based, +1 for header

        const response = await this.fetch(':batchUpdate', {
            method: 'POST',
            body: JSON.stringify({
                requests: [{
                    deleteDimension: {
                        range: {
                            sheetId: sheet.properties.sheetId,
                            dimension: 'ROWS',
                            startIndex: sheetRowIndex,
                            endIndex: sheetRowIndex + 1,
                        },
                    },
                }],
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to delete row: ${error}`);
        }

        return true;
    }

    // Get a single row by ID
    async getRowById(sheetName: string, id: string): Promise<SheetRow | null> {
        const rows = await this.getRows(sheetName);
        return rows.find(row => row.id === id) || null;
    }

    // Initialize sheet with headers if empty
    async initializeSheet(sheetName: string, headers: string[]): Promise<void> {
        const response = await this.fetch(`/values/${encodeURIComponent(sheetName)}!1:1`);
        const data: { values?: string[][] } = await response.json();

        if (!data.values || data.values.length === 0) {
            // Sheet is empty, add headers
            await this.fetch(
                `/values/${encodeURIComponent(sheetName)}!A1?valueInputOption=RAW`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ values: [headers] }),
                }
            );
        }
    }
}

export { GoogleSheetsClient, type SheetRow, type SheetsConfig };
