import { useAuth } from '@/context/AuthContext';

// Whitelist of allowed OAuth error messages to prevent reflected content
const ERROR_MESSAGES: Record<string, string> = {
    access_denied: 'Access was denied. Please try again.',
    server_error: 'A server error occurred during authentication.',
    temporarily_unavailable: 'The service is temporarily unavailable. Please try later.',
    invalid_scope: 'Invalid permissions requested. Please contact support.',
};

export function LoginPage() {
    const { login } = useAuth();
    const searchParams = new URLSearchParams(window.location.search);
    const errorParam = searchParams.get('error');
    const error = errorParam
        ? ERROR_MESSAGES[errorParam] || 'Authentication failed. Please try again.'
        : null;

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <h1>SheetCRM</h1>
                    <p className="login-subtitle">
                        Manage your contacts with Google Sheets
                    </p>
                </div>

                {error && (
                    <div className="login-error">
                        <p>Authentication failed: {error}</p>
                    </div>
                )}

                <button
                    className="google-signin-btn"
                    onClick={login}
                    type="button"
                >
                    <svg viewBox="0 0 48 48" width="24" height="24">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span>Sign in with Google</span>
                </button>

                <div className="login-features">
                    <div className="login-feature">
                        <span className="feature-icon">📊</span>
                        <span>Uses your Google Sheets as database</span>
                    </div>
                    <div className="login-feature">
                        <span className="feature-icon">🔒</span>
                        <span>Secure OAuth 2.0 authentication</span>
                    </div>
                    <div className="login-feature">
                        <span className="feature-icon">✏️</span>
                        <span>Edit directly in Sheets or in-app</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
