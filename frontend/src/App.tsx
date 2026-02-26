import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { Layout } from '@/components/layout';
import { DashboardPage, ContactsPage, CompaniesPage, RemindersPage, LoginPage, ProfilePage } from '@/pages';

function App() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" />
                <p>Loading...</p>
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
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </Layout>
        </ToastProvider>
    );
}

export default App;
