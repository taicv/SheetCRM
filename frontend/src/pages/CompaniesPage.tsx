import { useState, useEffect } from 'react';
import type { Company, CompanyFormData } from '@/types';
import { companiesApi } from '@/services/api';
import { useToast } from '@/context/ToastContext';

// Validate and sanitize URLs — only allow http/https protocols
function sanitizeUrl(url: string): string | null {
    try {
        const withProtocol = url.startsWith('http') ? url : `https://${url}`;
        const parsed = new URL(withProtocol);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return parsed.href;
        }
        return null;
    } catch {
        return null;
    }
}

export function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
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
            const data = await companiesApi.getAll();
            setCompanies(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load companies');
        } finally {
            setLoading(false);
        }
    }

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.industry?.toLowerCase().includes(search.toLowerCase()))
    );

    async function handleSave(data: CompanyFormData) {
        try {
            setSubmitting(true);
            if (editingCompany) {
                await companiesApi.update(editingCompany.id, data);
                toast.success('Đã cập nhật company!');
            } else {
                await companiesApi.create(data);
                toast.success('Đã thêm company mới!');
            }
            setShowModal(false);
            setEditingCompany(null);
            loadData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Lưu thất bại');
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bạn có chắc muốn xóa company này?')) return;
        try {
            setDeletingId(id);
            await companiesApi.delete(id);
            toast.success('Đã xóa company!');
            loadData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Xóa thất bại');
        } finally {
            setDeletingId(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin text-4xl">🔄</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600">❌ {error}</p>
                <button onClick={loadData} className="btn btn-primary mt-4">Thử lại</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
                <button
                    onClick={() => { setEditingCompany(null); setShowModal(true); }}
                    className="btn btn-primary"
                >
                    + Thêm Company
                </button>
            </div>

            <div className="max-w-md">
                <input
                    type="text"
                    placeholder="Tìm theo tên, ngành..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCompanies.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center py-8">
                        {search ? 'Không tìm thấy company' : 'Chưa có company nào'}
                    </p>
                ) : (
                    filteredCompanies.map((company) => (
                        <div key={company.id} className="card p-5">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">🏢</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{company.name}</h3>
                                    <p className="text-sm text-gray-500 truncate">{company.industry || 'Chưa phân loại'}</p>
                                    {company.website && (() => {
                                        const safeUrl = sanitizeUrl(company.website);
                                        return safeUrl ? (
                                            <a
                                                href={safeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary-600 hover:underline truncate block"
                                            >
                                                {company.website}
                                            </a>
                                        ) : null;
                                    })()}
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                                <button
                                    onClick={() => { setEditingCompany(company); setShowModal(true); }}
                                    className="text-sm text-primary-600 hover:text-primary-700"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(company.id)}
                                    disabled={deletingId === company.id}
                                    className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                                >
                                    {deletingId === company.id ? 'Đang xóa...' : 'Xóa'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <CompanyModal
                    company={editingCompany}
                    onSave={handleSave}
                    onClose={() => { setShowModal(false); setEditingCompany(null); }}
                    submitting={submitting}
                />
            )}
        </div>
    );
}

function CompanyModal({
    company,
    onSave,
    onClose,
    submitting,
}: {
    company: Company | null;
    onSave: (data: CompanyFormData) => void;
    onClose: () => void;
    submitting: boolean;
}) {
    const [formData, setFormData] = useState<CompanyFormData>({
        name: company?.name || '',
        industry: company?.industry || '',
        website: company?.website || '',
        address: company?.address || '',
        notes: company?.notes || '',
    });
    const toast = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên company');
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-lg mx-4">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">
                        {company ? 'Sửa Company' : 'Thêm Company mới'}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="label">Tên Company *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="input"
                            placeholder="ABC Corporation"
                        />
                    </div>
                    <div>
                        <label className="label">Ngành</label>
                        <input
                            type="text"
                            value={formData.industry}
                            onChange={e => setFormData({ ...formData, industry: e.target.value })}
                            className="input"
                            placeholder="Retail, Tech, Services..."
                        />
                    </div>
                    <div>
                        <label className="label">Website</label>
                        <input
                            type="text"
                            value={formData.website}
                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                            className="input"
                            placeholder="www.example.com"
                        />
                    </div>
                    <div>
                        <label className="label">Địa chỉ</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            className="input"
                            placeholder="123 Nguyen Hue, Q1, HCM"
                        />
                    </div>
                    <div>
                        <label className="label">Ghi chú</label>
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="input"
                            rows={3}
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {submitting && <span className="animate-spin inline-block">⏳</span>}
                            {submitting ? 'Đang lưu...' : (company ? 'Cập nhật' : 'Thêm')}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="btn btn-secondary disabled:opacity-60"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
