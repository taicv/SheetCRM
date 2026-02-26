import { useState, useEffect } from 'react';
import type { Contact, Company, ContactFormData } from '@/types';
import { contactsApi, companiesApi } from '@/services/api';
import { useToast } from '@/context/ToastContext';

export function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
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
            const [contactsData, companiesData] = await Promise.all([
                contactsApi.getAll(),
                companiesApi.getAll(),
            ]);
            setContacts(contactsData);
            setCompanies(companiesData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải danh sách liên hệ');
        } finally {
            setLoading(false);
        }
    }

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.email?.toLowerCase().includes(search.toLowerCase())) ||
        (c.phone?.includes(search))
    );

    const getCompanyName = (companyId?: string) => {
        if (!companyId) return '-';
        return companies.find(c => c.id === companyId)?.name || '-';
    };

    async function handleSave(data: ContactFormData) {
        try {
            setSubmitting(true);
            if (editingContact) {
                await contactsApi.update(editingContact.id, data);
                toast.success('Đã cập nhật liên hệ!');
            } else {
                await contactsApi.create(data);
                toast.success('Đã thêm liên hệ mới!');
            }
            setShowModal(false);
            setEditingContact(null);
            loadData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Lưu thất bại');
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bạn có chắc muốn xóa liên hệ này?')) return;
        try {
            setDeletingId(id);
            await contactsApi.delete(id);
            toast.success('Đã xóa liên hệ!');
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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <p className="text-red-600 dark:text-red-400">❌ {error}</p>
                <button onClick={loadData} className="btn btn-primary mt-4">Thử lại</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Liên hệ</h1>
                <button
                    onClick={() => { setEditingContact(null); setShowModal(true); }}
                    className="btn btn-primary"
                >
                    + Thêm liên hệ
                </button>
            </div>

            {/* Search */}
            <div className="max-w-md">
                <input
                    type="text"
                    placeholder="Tìm theo tên, email, SĐT..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input"
                />
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Tên</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">SĐT</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Công ty</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredContacts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    {search ? 'Không tìm thấy liên hệ' : 'Chưa có liên hệ nào'}
                                </td>
                            </tr>
                        ) : (
                            filteredContacts.map((contact) => (
                                <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                                                <span className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">{contact.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{contact.email || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{contact.phone || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{getCompanyName(contact.company_id)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setEditingContact(contact); setShowModal(true); }}
                                                className="text-sm text-primary-600 hover:text-primary-700"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(contact.id)}
                                                disabled={deletingId === contact.id}
                                                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                                            >
                                                {deletingId === contact.id ? 'Đang xóa...' : 'Xóa'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <ContactModal
                    contact={editingContact}
                    companies={companies}
                    onSave={handleSave}
                    onClose={() => { setShowModal(false); setEditingContact(null); }}
                    submitting={submitting}
                />
            )}
        </div>
    );
}

function ContactModal({
    contact,
    companies,
    onSave,
    onClose,
    submitting,
}: {
    contact: Contact | null;
    companies: Company[];
    onSave: (data: ContactFormData) => void;
    onClose: () => void;
    submitting: boolean;
}) {
    const [formData, setFormData] = useState<ContactFormData>({
        name: contact?.name || '',
        email: contact?.email || '',
        phone: contact?.phone || '',
        company_id: contact?.company_id || '',
        source: contact?.source || '',
        notes: contact?.notes || '',
    });
    const toast = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên liên hệ');
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold dark:text-white">
                        {contact ? 'Sửa liên hệ' : 'Thêm liên hệ mới'}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="label">Tên *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="input"
                            placeholder="Nguyễn Văn A"
                        />
                    </div>
                    <div>
                        <label className="label">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="input"
                            placeholder="email@example.com"
                        />
                    </div>
                    <div>
                        <label className="label">Số điện thoại</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="input"
                            placeholder="0912 345 678"
                        />
                    </div>
                    <div>
                        <label className="label">Công ty</label>
                        <select
                            value={formData.company_id}
                            onChange={e => setFormData({ ...formData, company_id: e.target.value })}
                            className="input"
                        >
                            <option value="">-- Chọn công ty --</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">Nguồn</label>
                        <input
                            type="text"
                            value={formData.source}
                            onChange={e => setFormData({ ...formData, source: e.target.value })}
                            className="input"
                            placeholder="Facebook, Website, Giới thiệu..."
                        />
                    </div>
                    <div>
                        <label className="label">Ghi chú</label>
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="input"
                            rows={3}
                            placeholder="Ghi chú về contact..."
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {submitting && <span className="animate-spin inline-block">⏳</span>}
                            {submitting ? 'Đang lưu...' : (contact ? 'Cập nhật' : 'Thêm')}
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
