import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export function Header({ onRefresh, isRefreshing }: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useAuth();
    const { isDark, toggle: toggleTheme } = useTheme();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

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
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 dark:bg-gray-800 dark:border-gray-700">
            {/* Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm liên hệ, công ty..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {/* Dark mode toggle */}
                <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center w-9 h-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                    title={isDark ? 'Chuyển sáng' : 'Chuyển tối'}
                >
                    {isDark ? '☀️' : '🌙'}
                </button>

                {/* Refresh button */}
                <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all disabled:opacity-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-700"
                    title="Đồng bộ dữ liệu từ Google Sheets"
                >
                    <span className={`${isRefreshing ? 'animate-spin' : ''}`}>🔄</span>
                    <span className="hidden sm:inline">Đồng bộ</span>
                </button>

                {/* User menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all dark:hover:bg-gray-700"
                    >
                        {user?.picture ? (
                            <img
                                src={user.picture}
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center dark:bg-primary-900/50">
                                <span className="text-primary-600 font-medium text-sm dark:text-primary-400">
                                    {user?.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                        )}
                        <span className="text-sm font-medium text-gray-700 hidden sm:inline dark:text-gray-300">
                            {user?.name || 'Người dùng'}
                        </span>
                    </button>

                    {/* Dropdown menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 dark:bg-gray-800 dark:border-gray-700">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowMenu(false);
                                    navigate('/profile');
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                👤 Hồ sơ cá nhân
                            </button>
                            <button
                                onClick={async () => {
                                    setShowMenu(false);
                                    await logout();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors dark:hover:bg-red-900/20"
                            >
                                🚪 Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
