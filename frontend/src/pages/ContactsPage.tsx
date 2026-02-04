import { useState, useEffect } from 'react';
import type { Contact, Company, ContactFormData } from '@/types';
import { contactsApi, companiesApi } from '@/services/api';

export function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);

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
            setError(err instanceof Error ? err.message : 'Failed to load contacts');
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
            if (editingContact) {
                await contactsApi.update(editingContact.id, data);
            } else {
                await contactsApi.create(data);
            }
            setShowModal(false);
            setEditingContact(null);
            loadData();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to save');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bạn có chắc muốn xóa contact này?')) return;
        try {
            await contactsApi.delete(id);
            loadData();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete');
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
                <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
                <button
                    onClick={() => { setEditingContact(null); setShowModal(true); }}
                    className="btn btn-primary"
                >
                    + Thêm Contact
                </button>
            </div>

            {/* Search */}
            <div className="max-w-md">
                <input
                    type="text"
                    placeholder="Tìm theo tên, email, phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input"
                />
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Tên</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Email</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Phone</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Company</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredContacts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    {search ? 'Không tìm thấy contact' : 'Chưa có contact nào'}
                                </td>
                            </tr>
                        ) : (
                            filteredContacts.map((contact) => (
                                <tr key={contact.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                                <span className="text-primary-600 text-sm font-medium">
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-900">{contact.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{contact.email || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600">{contact.phone || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600">{getCompanyName(contact.company_id)}</td>
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
                                                className="text-sm text-red-600 hover:text-red-700"
                                            >
                                                Xóa
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
}: {
    contact: Contact | null;
    companies: Company[];
    onSave: (data: ContactFormData) => void;
    onClose: () => void;
}) {
    const [formData, setFormData] = useState<ContactFormData>({
        name: contact?.name || '',
        email: contact?.email || '',
        phone: contact?.phone || '',
        company_id: contact?.company_id || '',
        source: contact?.source || '',
        notes: contact?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            alert('Vui lòng nhập tên');
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">
                        {contact ? 'Sửa Contact' : 'Thêm Contact mới'}
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
                        <label className="label">Company</label>
                        <select
                            value={formData.company_id}
                            onChange={e => setFormData({ ...formData, company_id: e.target.value })}
                            className="input"
                        >
                            <option value="">-- Chọn company --</option>
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
                        <button type="submit" className="btn btn-primary flex-1">
                            {contact ? 'Cập nhật' : 'Thêm'}
                        </button>
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
