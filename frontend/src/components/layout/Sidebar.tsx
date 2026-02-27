import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { to: '/', label: 'Tổng quan', icon: '📊' },
    { to: '/contacts', label: 'Liên hệ', icon: '👥' },
    { to: '/companies', label: 'Công ty', icon: '🏢' },
    { to: '/reminders', label: 'Nhắc nhở', icon: '⏰' },
    { to: '/deals', label: 'Deals', icon: '💰' },
    { to: '/profile', label: 'Hồ sơ', icon: '👤' },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const { user } = useAuth();

    const sidebarContent = (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col dark:bg-gray-800 dark:border-gray-700">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
                    <span className="text-2xl">🏢</span>
                    SheetCRM
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Google Sheets CRM [<a href="/landing">Giới thiệu</a>]</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100'
                                    }`
                                }
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            {user?.spreadsheetId && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <a
                        href={`https://docs.google.com/spreadsheets/d/${user.spreadsheetId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-primary-600 transition-colors dark:text-gray-400 dark:hover:text-primary-400"
                    >
                        <span>📄</span>
                        <span>Mở Google Sheet</span>
                    </a>
                </div>
            )}
        </aside>
    );

    return (
        <>
            {/* Desktop sidebar — always visible */}
            <div className="hidden md:block">
                {sidebarContent}
            </div>

            {/* Mobile overlay sidebar */}
            {isOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 transition-opacity"
                        onClick={onClose}
                    />
                    {/* Sidebar panel */}
                    <div className="relative z-50 animate-slide-in-left">
                        {sidebarContent}
                    </div>
                </div>
            )}
        </>
    );
}
