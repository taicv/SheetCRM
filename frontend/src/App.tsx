import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Layout } from '@/components/layout';
import { DashboardPage, ContactsPage, CompaniesPage, RemindersPage, DealsPage, LoginPage, ProfilePage } from '@/pages';
import { initAnalytics, track, identify } from '@/lib/analytics';

// Initialize analytics once on load
initAnalytics();

function AppRoutes() {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();

    // Track page views
    useEffect(() => {
        track('page_view', { path: location.pathname });
    }, [location.pathname]);

    // Identify user after login
    useEffect(() => {
        if (user) {
            identify(user.email, user.name);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" />
                <p>Đang tải...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return (
        <ToastProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/contacts" element={<ContactsPage />} />
                    <Route path="/companies" element={<CompaniesPage />} />
                    <Route path="/reminders" element={<RemindersPage />} />
                    <Route path="/deals" element={<DealsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </Layout>
        </ToastProvider>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AppRoutes />
        </ThemeProvider>
    );
}

export default App;
