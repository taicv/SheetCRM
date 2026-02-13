import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export function Header({ onRefresh, isRefreshing }: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            {/* Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search contacts, companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Refresh button */}
                <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all disabled:opacity-50"
                    title="Sync data from Google Sheets"
                >
                    <span className={`${isRefreshing ? 'animate-spin' : ''}`}>🔄</span>
                    <span className="hidden sm:inline">Sync</span>
                </button>

                {/* User menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
                    >
                        {user?.picture ? (
                            <img
                                src={user.picture}
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-600 font-medium text-sm">
                                    {user?.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                        )}
                        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                            {user?.name || 'User'}
                        </span>
                    </button>

                    {/* Dropdown menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                            <button
                                onClick={async () => {
                                    setShowMenu(false);
                                    await logout();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
