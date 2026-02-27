import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Stats {
    totalContacts: number;
    totalCompanies: number;
    upcomingReminders: number;
}

export function ProfilePage() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        fetch('/api/v1/dashboard/stats', { credentials: 'include' })
            .then(r => r.json())
            .then((data: Stats) => setStats(data))
            .catch(() => setStats(null))
            .finally(() => setLoadingStats(false));
    }, []);

    async function handleLogout() {
        setLoggingOut(true);
        await logout();
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hồ sơ cá nhân</h1>

            {/* User Info Card */}
            <div className="card p-6">
                <div className="flex items-center gap-5">
                    {user?.picture ? (
                        <img
                            src={user.picture}
                            alt={user.name}
                            className="w-20 h-20 rounded-full ring-4 ring-primary-100"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-bold text-3xl">
                                {user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                            ✓ Tài khoản Google
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Card */}
            <div className="card p-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Thống kê</h3>
                {loadingStats ? (
                    <div className="flex gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex-1 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.totalContacts ?? '—'}</p>
                            <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">Liên hệ</p>
                        </div>
                        <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats?.totalCompanies ?? '—'}</p>
                            <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-1">Công ty</p>
                        </div>
                        <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats?.upcomingReminders ?? '—'}</p>
                            <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">Nhắc nhở</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions Card */}
            <div className="card p-6 space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Tài nguyên</h3>

                {user?.spreadsheetId && (
                    <a
                        href={`https://docs.google.com/spreadsheets/d/${user.spreadsheetId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400"
                    >
                        <span className="text-xl">📄</span>
                        <div className="text-left">
                            <p className="font-medium text-sm">Mở Google Sheet của tôi</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Xem và chỉnh sửa dữ liệu trực tiếp</p>
                        </div>
                        <span className="ml-auto text-gray-400">↗</span>
                    </a>
                )}

                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-red-100 dark:border-red-900 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-red-600 disabled:opacity-60"
                >
                    <span className="text-xl">🚪</span>
                    <span className="font-medium text-sm">
                        {loggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
                    </span>
                </button>
            </div>
        </div>
    );
}
