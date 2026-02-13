// Google OAuth 2.0 Authentication for SheetCRM
// Replaces Service Account auth with user-based OAuth flow

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

// Scopes needed: Sheets read/write + user email
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
];

interface OAuthTokens {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
    scope?: string;
}

interface UserInfo {
    email: string;
    name: string;
    picture: string;
}

interface AuthSession {
    accessToken: string;
    refreshToken: string;
    expiresAt: number; // Unix timestamp in ms
    email: string;
    name: string;
    picture: string;
}

// Build Google OAuth consent URL
function getAuthorizationUrl(clientId: string, redirectUri: string): string {
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: SCOPES.join(' '),
        access_type: 'offline',   // Get refresh token
        prompt: 'consent',        // Always show consent to get refresh token
        include_granted_scopes: 'true',
    });
    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

// Exchange authorization code for tokens
async function exchangeCodeForTokens(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
): Promise<OAuthTokens> {
    const response = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Token exchange failed: ${error}`);
    }

    return response.json();
}

// Refresh an expired access token
async function refreshAccessToken(
    refreshToken: string,
    clientId: string,
    clientSecret: string
): Promise<OAuthTokens> {
    const response = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Token refresh failed: ${error}`);
    }

    return response.json();
}

// Fetch user info from Google
async function getUserInfo(accessToken: string): Promise<UserInfo> {
    const response = await fetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user info');
    }

    return response.json();
}

// --- Cookie-based session management using AES-GCM encryption ---

// Derive a CryptoKey from a secret string
async function deriveKey(secret: string): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: new TextEncoder().encode('sheetcrm-session-v1'),
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

// Encrypt session data into a cookie value
async function encryptSession(session: AuthSession, secret: string): Promise<string> {
    const key = await deriveKey(secret);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = new TextEncoder().encode(JSON.stringify(session));

    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
    );

    // Combine IV + ciphertext into a single base64 string
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
}

// Decrypt session data from a cookie value
async function decryptSession(encrypted: string, secret: string): Promise<AuthSession | null> {
    try {
        const key = await deriveKey(secret);
        const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));

        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);

        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            ciphertext
        );

        return JSON.parse(new TextDecoder().decode(decrypted));
    } catch {
        return null;
    }
}

// Parse a cookie header to find a specific cookie
function parseCookie(cookieHeader: string | null, name: string): string | null {
    if (!cookieHeader) return null;
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

// Build a Set-Cookie header value
function buildSetCookie(name: string, value: string, maxAge: number): string {
    return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

// Build a cookie deletion header
function buildDeleteCookie(name: string): string {
    return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

const SESSION_COOKIE_NAME = 'sheetcrm_session';
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export {
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
    type OAuthTokens,
    type UserInfo,
};
