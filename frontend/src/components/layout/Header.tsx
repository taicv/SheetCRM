import { useState } from 'react';

interface HeaderProps {
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export function Header({ onRefresh, isRefreshing }: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');

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
                        placeholder="Tìm kiếm contacts, companies..."
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
                    title="Đồng bộ dữ liệu từ Google Sheets"
                >
                    <span className={`${isRefreshing ? 'animate-spin' : ''}`}>🔄</span>
                    <span className="hidden sm:inline">Đồng bộ</span>
                </button>

                {/* User menu */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">U</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:inline">User</span>
                </div>
            </div>
        </header>
    );
}
