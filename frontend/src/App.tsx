import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { DashboardPage, ContactsPage, CompaniesPage, RemindersPage } from '@/pages';

function App() {
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
