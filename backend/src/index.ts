// MiniCRM API - Cloudflare Workers Entry Point
// OAuth 2.0 user-based authentication

import { GoogleSheetsClient, type SheetRow } from './sheets';
import {
    getAuthorizationUrl,
    exchangeCodeForTokens,
    refreshAccessToken,
    getUserInfo,
    encryptSession,
    decryptSession,
    parseCookie,
    buildSetCookie,
    buildDeleteCookie,
    SESSION_COOKIE_NAME,
    SESSION_MAX_AGE,
    type AuthSession,
} from './auth';

interface Env {
    SPREADSHEET_ID: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    COOKIE_SECRET: string;
    FRONTEND_URL?: string; // Optional: for production redirect
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
    'Access-Control-Allow-Credentials': 'true',
};

function jsonResponse(data: unknown, status = 200, extraHeaders?: Record<string, string>): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
            ...extraHeaders,
        },
    });
}

function errorResponse(message: string, status = 500): Response {
    return jsonResponse({ error: message, success: false }, status);
}

// Get the redirect URI for OAuth callbacks
function getRedirectUri(request: Request): string {
    const url = new URL(request.url);
    return `${url.origin}/api/v1/auth/callback`;
}

// Get the frontend URL for post-auth redirects
function getFrontendUrl(request: Request, env: Env): string {
    if (env.FRONTEND_URL) return env.FRONTEND_URL;
    // In dev, frontend runs on a different port
    const url = new URL(request.url);
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return `${url.protocol}//localhost:5173`;
    }
    return url.origin;
}

// Extract and validate user session from request cookie
async function getSession(request: Request, env: Env): Promise<AuthSession | null> {
    const cookieHeader = request.headers.get('Cookie');
    const sessionCookie = parseCookie(cookieHeader, SESSION_COOKIE_NAME);
    if (!sessionCookie) return null;

    const session = await decryptSession(sessionCookie, env.COOKIE_SECRET);
    if (!session) return null;

    // Check if access token is expired (with 5 min buffer)
    if (Date.now() > session.expiresAt - 5 * 60 * 1000) {
        // Try to refresh
        try {
            const tokens = await refreshAccessToken(
                session.refreshToken,
                env.GOOGLE_CLIENT_ID,
                env.GOOGLE_CLIENT_SECRET
            );
            session.accessToken = tokens.access_token;
            session.expiresAt = Date.now() + tokens.expires_in * 1000;
            // Note: refreshed session will be saved in the response cookie
            return session;
        } catch {
            // Refresh failed, session is invalid
            return null;
        }
    }

    return session;
}

// Create sheets client from user session
function createClient(env: Env, session: AuthSession): GoogleSheetsClient {
    return new GoogleSheetsClient({
        spreadsheetId: env.SPREADSHEET_ID,
        accessToken: session.accessToken,
    });
}

// Route handler type
type RouteHandler = (
    request: Request,
    params: Record<string, string>,
    client: GoogleSheetsClient | null,
    env: Env,
    session: AuthSession | null
) => Promise<Response>;

// Simple router
class Router {
    private routes: Array<{
        method: string;
        pattern: RegExp;
        handler: RouteHandler;
        paramNames: string[];
        requiresAuth: boolean;
    }> = [];

    add(method: string, path: string, handler: RouteHandler, requiresAuth = true) {
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
            requiresAuth,
        });
    }

    match(method: string, path: string): {
        handler: RouteHandler;
        params: Record<string, string>;
        requiresAuth: boolean;
    } | null {
        for (const route of this.routes) {
            if (route.method !== method) continue;
            const match = path.match(route.pattern);
            if (match) {
                const params: Record<string, string> = {};
                route.paramNames.forEach((name, i) => {
                    params[name] = match[i + 1];
                });
                return {
                    handler: route.handler,
                    params,
                    requiresAuth: route.requiresAuth,
                };
            }
        }
        return null;
    }
}

// Initialize router
const router = new Router();

// ==================== AUTH ROUTES (no auth required) ====================

// Login - redirect to Google OAuth consent screen
router.add('GET', '/api/v1/auth/login', async (request, _, __, env) => {
    const redirectUri = getRedirectUri(request);
    const authUrl = getAuthorizationUrl(env.GOOGLE_CLIENT_ID, redirectUri);

    return new Response(null, {
        status: 302,
        headers: {
            Location: authUrl,
            ...corsHeaders,
        },
    });
}, false);

// OAuth callback - exchange code for tokens, set session cookie
router.add('GET', '/api/v1/auth/callback', async (request, _, __, env) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
        const frontendUrl = getFrontendUrl(request, env);
        return new Response(null, {
            status: 302,
            headers: {
                Location: `${frontendUrl}/login?error=${encodeURIComponent(error)}`,
                ...corsHeaders,
            },
        });
    }

    if (!code) {
        return errorResponse('Missing authorization code', 400);
    }

    try {
        const redirectUri = getRedirectUri(request);
        const tokens = await exchangeCodeForTokens(
            code,
            env.GOOGLE_CLIENT_ID,
            env.GOOGLE_CLIENT_SECRET,
            redirectUri
        );

        // Get user info
        const userInfo = await getUserInfo(tokens.access_token);

        // Build session
        const session: AuthSession = {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token || '',
            expiresAt: Date.now() + tokens.expires_in * 1000,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
        };

        // Encrypt session into cookie
        const encryptedSession = await encryptSession(session, env.COOKIE_SECRET);
        const frontendUrl = getFrontendUrl(request, env);

        return new Response(null, {
            status: 302,
            headers: {
                Location: frontendUrl,
                'Set-Cookie': buildSetCookie(SESSION_COOKIE_NAME, encryptedSession, SESSION_MAX_AGE),
                ...corsHeaders,
            },
        });
    } catch (err) {
        console.error('OAuth callback error:', err);
        const message = err instanceof Error ? err.message : 'Authentication failed';
        return errorResponse(message, 500);
    }
}, false);

// Auth status - check if user is logged in
router.add('GET', '/api/v1/auth/status', async (request, _, __, env) => {
    const session = await getSession(request, env);

    if (!session) {
        return jsonResponse({ authenticated: false });
    }

    // If token was refreshed, update the cookie
    const headers: Record<string, string> = {};
    const encryptedSession = await encryptSession(session, env.COOKIE_SECRET);
    headers['Set-Cookie'] = buildSetCookie(SESSION_COOKIE_NAME, encryptedSession, SESSION_MAX_AGE);

    return jsonResponse({
        authenticated: true,
        user: {
            email: session.email,
            name: session.name,
            picture: session.picture,
        },
    }, 200, headers);
}, false);

// Logout - clear session cookie
router.add('POST', '/api/v1/auth/logout', async () => {
    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': buildDeleteCookie(SESSION_COOKIE_NAME),
            ...corsHeaders,
        },
    });
}, false);

// ==================== PROTECTED ROUTES (auth required) ====================

// Dashboard
router.add('GET', '/api/v1/dashboard/stats', async (_, __, client) => {
    const [contacts, companies, reminders] = await Promise.all([
        client!.getRows('contacts'),
        client!.getRows('companies'),
        client!.getRows('reminders'),
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
    const rows = await client!.getRows('contacts');
    return jsonResponse(rows);
});

router.add('GET', '/api/v1/contacts/:id', async (_, params, client) => {
    const row = await client!.getRowById('contacts', params.id);
    if (!row) return errorResponse('Contact not found', 404);
    return jsonResponse(row);
});

router.add('POST', '/api/v1/contacts', async (request, _, client) => {
    const data = await request.json() as SheetRow;
    const row = await client!.appendRow('contacts', data);
    return jsonResponse(row, 201);
});

router.add('PUT', '/api/v1/contacts/:id', async (request, params, client) => {
    const data = await request.json() as Partial<SheetRow>;
    const row = await client!.updateRow('contacts', params.id, data);
    if (!row) return errorResponse('Contact not found', 404);
    return jsonResponse(row);
});

router.add('DELETE', '/api/v1/contacts/:id', async (_, params, client) => {
    const success = await client!.deleteRow('contacts', params.id);
    if (!success) return errorResponse('Contact not found', 404);
    return jsonResponse({ success: true });
});

// Contact notes
router.add('GET', '/api/v1/contacts/:id/notes', async (_, params, client) => {
    const notes = await client!.getRows('notes');
    const filtered = notes.filter(n => n.contact_id === params.id);
    return jsonResponse(filtered);
});

router.add('POST', '/api/v1/contacts/:id/notes', async (request, params, client) => {
    const data = await request.json() as SheetRow;
    data.contact_id = params.id;
    const row = await client!.appendRow('notes', data);
    return jsonResponse(row, 201);
});

// Companies CRUD
router.add('GET', '/api/v1/companies', async (_, __, client) => {
    const rows = await client!.getRows('companies');
    return jsonResponse(rows);
});

router.add('GET', '/api/v1/companies/:id', async (_, params, client) => {
    const row = await client!.getRowById('companies', params.id);
    if (!row) return errorResponse('Company not found', 404);
    return jsonResponse(row);
});

router.add('POST', '/api/v1/companies', async (request, _, client) => {
    const data = await request.json() as SheetRow;
    const row = await client!.appendRow('companies', data);
    return jsonResponse(row, 201);
});

router.add('PUT', '/api/v1/companies/:id', async (request, params, client) => {
    const data = await request.json() as Partial<SheetRow>;
    const row = await client!.updateRow('companies', params.id, data);
    if (!row) return errorResponse('Company not found', 404);
    return jsonResponse(row);
});

router.add('DELETE', '/api/v1/companies/:id', async (_, params, client) => {
    const success = await client!.deleteRow('companies', params.id);
    if (!success) return errorResponse('Company not found', 404);
    return jsonResponse({ success: true });
});

router.add('GET', '/api/v1/companies/:id/contacts', async (_, params, client) => {
    const contacts = await client!.getRows('contacts');
    const filtered = contacts.filter(c => c.company_id === params.id);
    return jsonResponse(filtered);
});

// Reminders CRUD
router.add('GET', '/api/v1/reminders', async (request, _, client) => {
    const url = new URL(request.url);
    const dueBefore = url.searchParams.get('due_before');

    let rows = await client!.getRows('reminders');

    if (dueBefore) {
        const dueDate = new Date(dueBefore);
        rows = rows.filter(r => new Date(r.due_date) <= dueDate);
    }

    // Convert is_done string to boolean for JSON response
    const result = rows.map(r => ({
        ...r,
        is_done: r.is_done === 'TRUE' || r.is_done === 'true',
    }));

    return jsonResponse(result);
});

router.add('POST', '/api/v1/reminders', async (request, _, client) => {
    const data = await request.json() as SheetRow;
    // Convert boolean to string for Sheets
    if (typeof data.is_done === 'boolean') {
        data.is_done = data.is_done ? 'TRUE' : 'FALSE';
    }
    const row = await client!.appendRow('reminders', data);
    return jsonResponse({ ...row, is_done: row.is_done === 'TRUE' }, 201);
});

router.add('PUT', '/api/v1/reminders/:id', async (request, params, client) => {
    const data = await request.json() as Partial<SheetRow>;
    // Convert boolean to string for Sheets
    if (typeof data.is_done === 'boolean') {
        data.is_done = data.is_done ? 'TRUE' : 'FALSE';
    }
    const row = await client!.updateRow('reminders', params.id, data);
    if (!row) return errorResponse('Reminder not found', 404);
    return jsonResponse({ ...row, is_done: row.is_done === 'TRUE' });
});

router.add('DELETE', '/api/v1/reminders/:id', async (_, params, client) => {
    const success = await client!.deleteRow('reminders', params.id);
    if (!success) return errorResponse('Reminder not found', 404);
    return jsonResponse({ success: true });
});

// Initialize sheets endpoint (call once to set up headers)
router.add('POST', '/api/v1/init', async (_, __, client) => {
    for (const [sheetName, headers] of Object.entries(SHEET_SCHEMAS)) {
        await client!.initializeSheet(sheetName, headers);
    }
    return jsonResponse({ success: true, message: 'Sheets initialized' });
});

// ==================== MAIN FETCH HANDLER ====================

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

            let session: AuthSession | null = null;
            let client: GoogleSheetsClient | null = null;

            if (match.requiresAuth) {
                // Validate session for protected routes
                session = await getSession(request, env);
                if (!session) {
                    return errorResponse('Unauthorized. Please sign in.', 401);
                }
                client = createClient(env, session);
            }

            const response = await match.handler(request, match.params, client, env, session);

            // If session was refreshed, update the cookie on the response
            if (session && match.requiresAuth) {
                const encryptedSession = await encryptSession(session, env.COOKIE_SECRET);
                const newHeaders = new Headers(response.headers);
                newHeaders.set('Set-Cookie', buildSetCookie(SESSION_COOKIE_NAME, encryptedSession, SESSION_MAX_AGE));
                return new Response(response.body, {
                    status: response.status,
                    headers: newHeaders,
                });
            }

            return response;
        } catch (error) {
            console.error('Error:', error);
            const message = error instanceof Error ? error.message : 'Internal server error';
            return errorResponse(message, 500);
        }
    },
};
