import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/layout';
import { DashboardPage, ContactsPage, CompaniesPage, RemindersPage, LoginPage } from '@/pages';

function App() {
    const { isAuthenticated, loading } = useAuth();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" />
                <p>Loading...</p>
            </div>
        );
    }

    // Show login page if not authenticated
    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/reminders" element={<RemindersPage />} />
            </Routes>
        </Layout>
    );
}

export default App;
