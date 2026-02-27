import { ReactNode, useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        window.dispatchEvent(new CustomEvent('crm-refresh'));
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsRefreshing(false);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    onRefresh={handleRefresh}
                    isRefreshing={isRefreshing}
                    onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
                />
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
