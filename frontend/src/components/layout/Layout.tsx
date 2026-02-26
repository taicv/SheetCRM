import { ReactNode, useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        // Trigger a page refresh to re-fetch data
        // In a more sophisticated app, this would use a global state or context
        window.dispatchEvent(new CustomEvent('crm-refresh'));

        // Simulate delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsRefreshing(false);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
