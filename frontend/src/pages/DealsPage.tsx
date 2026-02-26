import { useState, useEffect } from 'react';
import type { Deal, DealFormData, Contact, Company } from '@/types';
import { dealsApi, contactsApi, companiesApi } from '@/services/api';
import { useToast } from '@/context/ToastContext';

const STAGES = [
    { value: 'lead', label: 'Tiềm năng', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
    { value: 'qualified', label: 'Đủ điều kiện', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
    { value: 'proposal', label: 'Đề xuất', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' },
    { value: 'negotiation', label: 'Đàm phán', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
    { value: 'won', label: 'Thành công', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
    { value: 'lost', label: 'Thất bại', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
];

function getStageInfo(stage?: string) {
    return STAGES.find(s => s.value === stage) || STAGES[0];
}

function formatCurrency(value?: string) {
    if (!value || value === '0') return '—';
    const num = Number(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('vi-VN') + ' ₫';
}

export function DealsPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    useEffect(() => {
        loadData();
        const handleRefresh = () => loadData();
        window.addEventListener('crm-refresh', handleRefresh);
        return () => window.removeEventListener('crm-refresh', handleRefresh);
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);
            const [d, c, co] = await Promise.all([
                dealsApi.getAll(),
                contactsApi.getAll(),
                companiesApi.getAll(),
            ]);
            setDeals(d);
            setContacts(c);
            setCompanies(co);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }

    function getContactName(contactId?: string) {
        if (!contactId) return '—';
        return contacts.find(c => c.id === contactId)?.name || '—';
    }

    function getCompanyName(companyId?: string) {
        if (!companyId) return '—';
        return companies.find(c => c.id === companyId)?.name || '—';
    }

    async function handleSave(data: DealFormData) {
        try {
            setSubmitting(true);
            if (editingDeal) {
                await dealsApi.update(editingDeal.id, data);
                toast.success('Cập nhật deal thành công');
            } else {
                await dealsApi.create(data);
                toast.success('Tạo deal thành công');
            }
            setShowModal(false);
            setEditingDeal(null);
            await loadData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bạn có chắc muốn xóa deal này?')) return;
        try {
            await dealsApi.delete(id);
            toast.success('Đã xóa deal');
            await loadData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra');
        }
    }

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
                <button onClick={loadData} className="btn btn-primary">Thử lại</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">💰 Deals</h1>
                <button
                    onClick={() => { setEditingDeal(null); setShowModal(true); }}
                    className="btn btn-primary"
                >
                    + Tạo Deal
                </button>
            </div>

            {/* Stage summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {STAGES.map(stage => {
                    const count = deals.filter(d => (d.stage || 'lead') === stage.value).length;
                    return (
                        <div key={stage.value} className="card p-3 text-center">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                                {stage.label}
                            </span>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Deals table */}
            {deals.length === 0 ? (
                <div className="card p-12 text-center">
                    <span className="text-5xl mb-4 block">💰</span>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Chưa có deal nào</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Bấm "Tạo Deal" để bắt đầu</p>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Tên Deal</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Giá trị</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Giai đoạn</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Liên hệ</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Công ty</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Ngày chốt dự kiến</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {deals.map(deal => {
                                    const stageInfo = getStageInfo(deal.stage);
                                    return (
                                        <tr key={deal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{deal.title}</p>
                                                {deal.notes && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-xs">{deal.notes}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {formatCurrency(deal.value)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${stageInfo.color}`}>
                                                    {stageInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{getContactName(deal.contact_id)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{getCompanyName(deal.company_id)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {deal.expected_close_date ? new Date(deal.expected_close_date).toLocaleDateString('vi-VN') : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => { setEditingDeal(deal); setShowModal(true); }}
                                                    className="text-primary-600 hover:text-primary-800 text-sm mr-3 dark:text-primary-400 dark:hover:text-primary-300"
                                                >
                                                    ✏️ Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(deal.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    🗑 Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <DealModal
                    deal={editingDeal}
                    contacts={contacts}
                    companies={companies}
                    onSave={handleSave}
                    onClose={() => { setShowModal(false); setEditingDeal(null); }}
                    submitting={submitting}
                />
            )}
        </div>
    );
}

function DealModal({
    deal,
    contacts,
    companies,
    onSave,
    onClose,
    submitting,
}: {
    deal: Deal | null;
    contacts: Contact[];
    companies: Company[];
    onSave: (data: DealFormData) => void;
    onClose: () => void;
    submitting: boolean;
}) {
    const [title, setTitle] = useState(deal?.title ?? '');
    const [value, setValue] = useState(deal?.value ?? '');
    const [stage, setStage] = useState(deal?.stage ?? 'lead');
    const [contactId, setContactId] = useState(deal?.contact_id ?? '');
    const [companyId, setCompanyId] = useState(deal?.company_id ?? '');
    const [expectedCloseDate, setExpectedCloseDate] = useState(deal?.expected_close_date ?? '');
    const [notes, setNotes] = useState(deal?.notes ?? '');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSave({
            title,
            value: value || undefined,
            stage,
            contact_id: contactId || undefined,
            company_id: companyId || undefined,
            expected_close_date: expectedCloseDate || undefined,
            notes: notes || undefined,
        });
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {deal ? '✏️ Sửa Deal' : '💰 Tạo Deal mới'}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tên Deal *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            className="input"
                            placeholder="VD: Hợp đồng ABC Corp"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Giá trị (VNĐ)
                            </label>
                            <input
                                type="number"
                                value={value}
                                onChange={e => setValue(e.target.value)}
                                className="input"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Giai đoạn
                            </label>
                            <select
                                value={stage}
                                onChange={e => setStage(e.target.value)}
                                className="input"
                            >
                                {STAGES.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Liên hệ
                            </label>
                            <select
                                value={contactId}
                                onChange={e => setContactId(e.target.value)}
                                className="input"
                            >
                                <option value="">— Chọn liên hệ —</option>
                                {contacts.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Công ty
                            </label>
                            <select
                                value={companyId}
                                onChange={e => setCompanyId(e.target.value)}
                                className="input"
                            >
                                <option value="">— Chọn công ty —</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Ngày chốt dự kiến
                        </label>
                        <input
                            type="date"
                            value={expectedCloseDate}
                            onChange={e => setExpectedCloseDate(e.target.value)}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Ghi chú
                        </label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={3}
                            className="input"
                            placeholder="Ghi chú thêm về deal..."
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary flex-1"
                        >
                            {submitting ? 'Đang lưu...' : deal ? 'Cập nhật' : 'Tạo Deal'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary flex-1"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
