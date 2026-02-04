// MiniCRM API - Cloudflare Workers Entry Point

import { GoogleSheetsClient, type SheetRow } from './sheets';

interface Env {
    SPREADSHEET_ID: string;
    GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
    GOOGLE_PRIVATE_KEY: string;
}

// Sheet schemas for initialization
const SHEET_SCHEMAS = {
    contacts: ['id', 'name', 'email', 'phone', 'company_id', 'source', 'notes', 'created_at', 'updated_at'],
    companies: ['id', 'name', 'industry', 'website', 'address', 'notes', 'created_at', 'updated_at'],
    notes: ['id', 'contact_id', 'content', 'created_at'],
    reminders: ['id', 'contact_id', 'title', 'due_date', 'is_done', 'created_at'],
};

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
        },
    });
}

function errorResponse(message: string, status = 500): Response {
    return jsonResponse({ error: message, success: false }, status);
}

// Create sheets client
function createClient(env: Env): GoogleSheetsClient {
    // Validate required secrets
    if (!env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_PRIVATE_KEY) {
        throw new Error('Missing Google credentials. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in .dev.vars for local dev or as secrets for production.');
    }

    return new GoogleSheetsClient({
        spreadsheetId: env.SPREADSHEET_ID,
        credentials: {
            email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            privateKey: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
    });
}

// Route handler type
type RouteHandler = (
    request: Request,
    params: Record<string, string>,
    client: GoogleSheetsClient
) => Promise<Response>;

// Simple router
class Router {
    private routes: Array<{
        method: string;
        pattern: RegExp;
        handler: RouteHandler;
        paramNames: string[];
    }> = [];

    add(method: string, path: string, handler: RouteHandler) {
        const paramNames: string[] = [];
        const pattern = path.replace(/:(\w+)/g, (_, name) => {
            paramNames.push(name);
            return '([^/]+)';
        });
        this.routes.push({
            method,
            pattern: new RegExp(`^${pattern}$`),
            handler,
            paramNames,
        });
    }

    match(method: string, path: string): { handler: RouteHandler; params: Record<string, string> } | null {
        for (const route of this.routes) {
            if (route.method !== method) continue;
            const match = path.match(route.pattern);
            if (match) {
                const params: Record<string, string> = {};
                route.paramNames.forEach((name, i) => {
                    params[name] = match[i + 1];
                });
                return { handler: route.handler, params };
            }
        }
        return null;
    }
}

// Initialize router
const router = new Router();

// Dashboard
router.add('GET', '/api/v1/dashboard/stats', async (_, __, client) => {
    const [contacts, companies, reminders] = await Promise.all([
        client.getRows('contacts'),
        client.getRows('companies'),
        client.getRows('reminders'),
    ]);

    return jsonResponse({
        totalContacts: contacts.length,
        totalCompanies: companies.length,
        upcomingReminders: reminders.filter(r => r.is_done !== 'TRUE').length,
        recentActivities: [],
    });
});

// Contacts CRUD
router.add('GET', '/api/v1/contacts', async (_, __, client) => {
    const rows = await client.getRows('contacts');
    return jsonResponse(rows);
});

router.add('GET', '/api/v1/contacts/:id', async (_, params, client) => {
    const row = await client.getRowById('contacts', params.id);
    if (!row) return errorResponse('Contact not found', 404);
    return jsonResponse(row);
});

router.add('POST', '/api/v1/contacts', async (request, _, client) => {
    const data = await request.json() as SheetRow;
    const row = await client.appendRow('contacts', data);
    return jsonResponse(row, 201);
});

router.add('PUT', '/api/v1/contacts/:id', async (request, params, client) => {
    const data = await request.json() as Partial<SheetRow>;
    const row = await client.updateRow('contacts', params.id, data);
    if (!row) return errorResponse('Contact not found', 404);
    return jsonResponse(row);
});

router.add('DELETE', '/api/v1/contacts/:id', async (_, params, client) => {
    const success = await client.deleteRow('contacts', params.id);
    if (!success) return errorResponse('Contact not found', 404);
    return jsonResponse({ success: true });
});

// Contact notes
router.add('GET', '/api/v1/contacts/:id/notes', async (_, params, client) => {
    const notes = await client.getRows('notes');
    const filtered = notes.filter(n => n.contact_id === params.id);
    return jsonResponse(filtered);
});

router.add('POST', '/api/v1/contacts/:id/notes', async (request, params, client) => {
    const data = await request.json() as SheetRow;
    data.contact_id = params.id;
    const row = await client.appendRow('notes', data);
    return jsonResponse(row, 201);
});

// Companies CRUD
router.add('GET', '/api/v1/companies', async (_, __, client) => {
    const rows = await client.getRows('companies');
    return jsonResponse(rows);
});

router.add('GET', '/api/v1/companies/:id', async (_, params, client) => {
    const row = await client.getRowById('companies', params.id);
    if (!row) return errorResponse('Company not found', 404);
    return jsonResponse(row);
});

router.add('POST', '/api/v1/companies', async (request, _, client) => {
    const data = await request.json() as SheetRow;
    const row = await client.appendRow('companies', data);
    return jsonResponse(row, 201);
});

router.add('PUT', '/api/v1/companies/:id', async (request, params, client) => {
    const data = await request.json() as Partial<SheetRow>;
    const row = await client.updateRow('companies', params.id, data);
    if (!row) return errorResponse('Company not found', 404);
    return jsonResponse(row);
});

router.add('DELETE', '/api/v1/companies/:id', async (_, params, client) => {
    const success = await client.deleteRow('companies', params.id);
    if (!success) return errorResponse('Company not found', 404);
    return jsonResponse({ success: true });
});

router.add('GET', '/api/v1/companies/:id/contacts', async (_, params, client) => {
    const contacts = await client.getRows('contacts');
    const filtered = contacts.filter(c => c.company_id === params.id);
    return jsonResponse(filtered);
});

// Reminders CRUD
router.add('GET', '/api/v1/reminders', async (request, _, client) => {
    const url = new URL(request.url);
    const dueBefore = url.searchParams.get('due_before');

    let rows = await client.getRows('reminders');

    if (dueBefore) {
        const dueDate = new Date(dueBefore);
        rows = rows.filter(r => new Date(r.due_date) <= dueDate);
    }

    // Convert is_done string to boolean
    rows = rows.map(r => ({
        ...r,
        is_done: r.is_done === 'TRUE' || r.is_done === 'true',
    }));

    return jsonResponse(rows);
});

router.add('POST', '/api/v1/reminders', async (request, _, client) => {
    const data = await request.json() as SheetRow;
    // Convert boolean to string for Sheets
    if (typeof data.is_done === 'boolean') {
        data.is_done = data.is_done ? 'TRUE' : 'FALSE';
    }
    const row = await client.appendRow('reminders', data);
    return jsonResponse({ ...row, is_done: row.is_done === 'TRUE' }, 201);
});

router.add('PUT', '/api/v1/reminders/:id', async (request, params, client) => {
    const data = await request.json() as Partial<SheetRow>;
    // Convert boolean to string for Sheets
    if (typeof data.is_done === 'boolean') {
        data.is_done = data.is_done ? 'TRUE' : 'FALSE';
    }
    const row = await client.updateRow('reminders', params.id, data);
    if (!row) return errorResponse('Reminder not found', 404);
    return jsonResponse({ ...row, is_done: row.is_done === 'TRUE' });
});

router.add('DELETE', '/api/v1/reminders/:id', async (_, params, client) => {
    const success = await client.deleteRow('reminders', params.id);
    if (!success) return errorResponse('Reminder not found', 404);
    return jsonResponse({ success: true });
});

// Initialize sheets endpoint (call once to set up headers)
router.add('POST', '/api/v1/init', async (_, __, client) => {
    for (const [sheetName, headers] of Object.entries(SHEET_SCHEMAS)) {
        await client.initializeSheet(sheetName, headers);
    }
    return jsonResponse({ success: true, message: 'Sheets initialized' });
});

// Main fetch handler
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            const url = new URL(request.url);
            const path = url.pathname;
            const method = request.method;

            const match = router.match(method, path);
            if (!match) {
                return errorResponse('Not found', 404);
            }

            const client = createClient(env);
            return await match.handler(request, match.params, client);
        } catch (error) {
            console.error('Error:', error);
            const message = error instanceof Error ? error.message : 'Internal server error';
            return errorResponse(message, 500);
        }
    },
};
