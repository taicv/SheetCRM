import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    email: string;
    name: string;
    picture: string;
    spreadsheetId: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: () => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check auth status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    async function checkAuthStatus() {
        try {
            const response = await fetch('/api/v1/auth/status', {
                credentials: 'include',
            });
            const data = await response.json();

            if (data.authenticated) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    function login() {
        // Redirect to backend OAuth login endpoint
        window.location.href = '/api/v1/auth/login';
    }

    async function logout() {
        try {
            await fetch('/api/v1/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch {
            // Ignore errors on logout
        }
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export type { User };
