// Google Sheets API Authentication using Service Account JWT
// Reference: https://developers.google.com/identity/protocols/oauth2/service-account

interface ServiceAccountCredentials {
    email: string;
    privateKey: string;
}

interface AccessTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

// Convert base64url to ArrayBuffer
function base64UrlToArrayBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(base64 + padding);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

// Convert ArrayBuffer to base64url
function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Parse PEM private key to CryptoKey
async function importPrivateKey(pem: string): Promise<CryptoKey> {
    // Remove PEM headers and newlines
    const pemContents = pem
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/-----BEGIN RSA PRIVATE KEY-----/g, '')
        .replace(/-----END RSA PRIVATE KEY-----/g, '')
        .replace(/\s/g, '');

    const keyData = base64UrlToArrayBuffer(
        pemContents.replace(/\+/g, '-').replace(/\//g, '_')
    );

    return await crypto.subtle.importKey(
        'pkcs8',
        keyData,
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256',
        },
        false,
        ['sign']
    );
}

// Create signed JWT
async function createSignedJWT(
    credentials: ServiceAccountCredentials,
    scopes: string[]
): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600; // 1 hour

    const header = {
        alg: 'RS256',
        typ: 'JWT',
    };

    const payload = {
        iss: credentials.email,
        scope: scopes.join(' '),
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: exp,
    };

    const encodedHeader = arrayBufferToBase64Url(
        new TextEncoder().encode(JSON.stringify(header))
    );
    const encodedPayload = arrayBufferToBase64Url(
        new TextEncoder().encode(JSON.stringify(payload))
    );

    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const privateKey = await importPrivateKey(credentials.privateKey);
    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        privateKey,
        new TextEncoder().encode(signatureInput)
    );

    const encodedSignature = arrayBufferToBase64Url(signature);

    return `${signatureInput}.${encodedSignature}`;
}

// Exchange JWT for access token
async function getAccessToken(
    credentials: ServiceAccountCredentials
): Promise<string> {
    const jwt = await createSignedJWT(credentials, [
        'https://www.googleapis.com/auth/spreadsheets',
    ]);

    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get access token: ${error}`);
    }

    const data: AccessTokenResponse = await response.json();
    return data.access_token;
}

export { getAccessToken, type ServiceAccountCredentials };
