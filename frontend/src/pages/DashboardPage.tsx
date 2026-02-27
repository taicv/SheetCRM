import { useState, useEffect } from 'react';
import type { DashboardStats, Contact, Reminder, Deal } from '@/types';
import { contactsApi, companiesApi, remindersApi, dealsApi } from '@/services/api';

const STAGES = [
    { value: 'lead', label: 'Tiềm năng', color: 'bg-gray-400', textColor: 'text-gray-700 dark:text-gray-300' },
    { value: 'qualified', label: 'Đủ điều kiện', color: 'bg-blue-500', textColor: 'text-blue-700 dark:text-blue-400' },
    { value: 'proposal', label: 'Đề xuất', color: 'bg-purple-500', textColor: 'text-purple-700 dark:text-purple-400' },
    { value: 'negotiation', label: 'Đàm phán', color: 'bg-amber-500', textColor: 'text-amber-700 dark:text-amber-400' },
    { value: 'won', label: 'Thành công', color: 'bg-green-500', textColor: 'text-green-700 dark:text-green-400' },
    { value: 'lost', label: 'Thất bại', color: 'bg-red-500', textColor: 'text-red-700 dark:text-red-400' },
];

function formatVND(value: number) {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + ' tỷ';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' tr';
    if (value >= 1_000) return (value / 1_000).toFixed(0) + 'k';
    return value.toLocaleString('vi-VN') + ' ₫';
}

export function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
    const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardData();
        const handleRefresh = () => loadDashboardData();
        window.addEventListener('crm-refresh', handleRefresh);
        return () => window.removeEventListener('crm-refresh', handleRefresh);
    }, []);

    async function loadDashboardData() {
        try {
            setLoading(true);
            setError(null);

            const [contacts, companies, reminders, allDeals] = await Promise.all([
                contactsApi.getAll(),
                companiesApi.getAll(),
                remindersApi.getAll(),
                dealsApi.getAll(),
            ]);

            setDeals(allDeals);

            const sorted = [...contacts].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setRecentContacts(sorted.slice(0, 5));

            const now = new Date();
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            const upcoming = reminders
                .filter(r => !r.is_done && new Date(r.due_date) <= weekFromNow)
                .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                .slice(0, 5);
            setUpcomingReminders(upcoming);

            setStats({
                totalContacts: contacts.length,
                totalCompanies: companies.length,
                totalDeals: allDeals.length,
                upcomingReminders: reminders.filter(r => !r.is_done).length,
                recentActivities: [],
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }

    // Deals analytics
    const pipelineDeals = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost');
    const pipelineValue = pipelineDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    const wonDeals = deals.filter(d => d.stage === 'won');
    const wonValue = wonDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    const lostDeals = deals.filter(d => d.stage === 'lost');

    const stageCounts = STAGES.map(s => ({
        ...s,
        count: deals.filter(d => (d.stage || 'lead') === s.value).length,
        totalValue: deals.filter(d => (d.stage || 'lead') === s.value).reduce((sum, d) => sum + (Number(d.value) || 0), 0),
    }));
    const maxStageCount = Math.max(...stageCounts.map(s => s.count), 1);

    const recentDeals = [...deals]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">🔄</div>
                    <p className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center dark:bg-red-900/20 dark:border-red-800">
                <p className="text-red-600 mb-4 dark:text-red-400">❌ {error}</p>
                <button onClick={loadDashboardData} className="btn btn-primary">Thử lại</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tổng quan</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="👥" label="Liên hệ" value={stats?.totalContacts || 0} color="blue" />
                <StatCard icon="🏢" label="Công ty" value={stats?.totalCompanies || 0} color="emerald" />
                <StatCard icon="💰" label="Deals" value={stats?.totalDeals || 0} color="purple" />
                <StatCard icon="⏰" label="Nhắc nhở" value={stats?.upcomingReminders || 0} color="amber" />
            </div>

            {/* ==================== DEALS REPORT ==================== */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>📊</span> Báo cáo Deals
                </h2>

                {/* Deal value summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card p-5 border-l-4 border-purple-500">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pipeline (đang mở)</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {pipelineValue > 0 ? formatVND(pipelineValue) : '0 ₫'}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{pipelineDeals.length} deal đang mở</p>
                    </div>
                    <div className="card p-5 border-l-4 border-green-500">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Đã thành công</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                            {wonValue > 0 ? formatVND(wonValue) : '0 ₫'}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{wonDeals.length} deal thành công</p>
                    </div>
                    <div className="card p-5 border-l-4 border-red-500">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tỷ lệ thắng</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {wonDeals.length + lostDeals.length > 0
                                ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100) + '%'
                                : '—'}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {wonDeals.length} thắng / {lostDeals.length} thua
                        </p>
                    </div>
                </div>

                {/* Pipeline stages + Recent deals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pipeline by stage */}
                    <div className="card p-6">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span>📈</span> Pipeline theo giai đoạn
                        </h3>
                        {deals.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">Chưa có deal nào</p>
                        ) : (
                            <div className="space-y-3">
                                {stageCounts.map(stage => (
                                    <div key={stage.value}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-sm font-medium ${stage.textColor}`}>{stage.label}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                                    {stage.totalValue > 0 ? formatVND(stage.totalValue) : ''}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white w-6 text-right">
                                                    {stage.count}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                                            <div
                                                className={`${stage.color} h-2.5 rounded-full transition-all duration-500`}
                                                style={{ width: `${(stage.count / maxStageCount) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Deals */}
                    <div className="card p-6">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span>💰</span> Deals gần đây
                        </h3>
                        {recentDeals.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">Chưa có deal nào</p>
                        ) : (
                            <ul className="space-y-3">
                                {recentDeals.map(deal => {
                                    const stageInfo = STAGES.find(s => s.value === (deal.stage || 'lead')) || STAGES[0];
                                    const val = Number(deal.value) || 0;
                                    return (
                                        <li key={deal.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-700/50">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate dark:text-gray-100">{deal.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${stageInfo.color} text-white`}>
                                                        {stageInfo.label}
                                                    </span>
                                                    {val > 0 && (
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {formatVND(val)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                                                {new Date(deal.created_at).toLocaleDateString('vi-VN')}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* ==================== CONTACTS & REMINDERS ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Contacts */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 dark:text-white">
                        <span>👤</span> Liên hệ mới
                    </h2>
                    {recentContacts.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">Chưa có liên hệ nào</p>
                    ) : (
                        <ul className="space-y-3">
                            {recentContacts.map((contact) => (
                                <li key={contact.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-700/50">
                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center dark:bg-primary-900/50">
                                        <span className="text-primary-600 font-medium dark:text-primary-400">
                                            {contact.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate dark:text-gray-100">{contact.name}</p>
                                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">{contact.email || contact.phone || 'Không có thông tin'}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Upcoming Reminders */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 dark:text-white">
                        <span>⏰</span> Nhắc nhở sắp tới
                    </h2>
                    {upcomingReminders.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">Không có nhắc nhở</p>
                    ) : (
                        <ul className="space-y-3">
                            {upcomingReminders.map((reminder) => (
                                <li key={reminder.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg dark:bg-amber-900/20">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center dark:bg-amber-900/40">
                                        <span className="text-lg">📅</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate dark:text-gray-100">{reminder.title}</p>
                                        <p className="text-sm text-amber-600 dark:text-amber-400">
                                            {new Date(reminder.due_date).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    color
}: {
    icon: string;
    label: string;
    value: number;
    color: 'blue' | 'emerald' | 'amber' | 'purple'
}) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    };

    return (
        <div className="card p-6">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
                    <span className="text-2xl">{icon}</span>
                </div>
                <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                </div>
            </div>
        </div>
    );
}
