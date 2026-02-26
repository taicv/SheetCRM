import { useState, useEffect } from 'react';
import type { Reminder, Contact, ReminderFormData } from '@/types';
import { remindersApi, contactsApi } from '@/services/api';
import { useToast } from '@/context/ToastContext';

export function RemindersPage() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'done'>('upcoming');
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);
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
            const [remindersData, contactsData] = await Promise.all([
                remindersApi.getAll(),
                contactsApi.getAll(),
            ]);
            setReminders(remindersData);
            setContacts(contactsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load reminders');
        } finally {
            setLoading(false);
        }
    }

    const getContactName = (contactId: string) => {
        return contacts.find(c => c.id === contactId)?.name || 'Unknown';
    };

    const filteredReminders = reminders
        .filter(r => {
            if (filter === 'done') return r.is_done;
            if (filter === 'upcoming') return !r.is_done;
            return true;
        })
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

    async function handleSave(data: ReminderFormData) {
        try {
            setSubmitting(true);
            await remindersApi.create(data);
            toast.success('Đã thêm reminder!');
            setShowModal(false);
            loadData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Lưu thất bại');
        } finally {
            setSubmitting(false);
        }
    }

    async function handleToggleDone(reminder: Reminder) {
        try {
            setTogglingId(reminder.id);
            await remindersApi.update(reminder.id, { is_done: !reminder.is_done });
            toast.success(reminder.is_done ? 'Đã bỏ hoàn thành!' : 'Đã hoàn thành!');
            loadData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Cập nhật thất bại');
        } finally {
            setTogglingId(null);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bạn có chắc muốn xóa reminder này?')) return;
        try {
            setDeletingId(id);
            await remindersApi.delete(id);
            toast.success('Đã xóa reminder!');
            loadData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Xóa thất bại');
        } finally {
            setDeletingId(null);
        }
    }

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date() && !reminders.find(r => r.due_date === dueDate)?.is_done;
    };

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
                <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary"
                >
                    + Thêm Reminder
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2">
                {(['upcoming', 'done', 'all'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {f === 'upcoming' ? 'Sắp tới' : f === 'done' ? 'Hoàn thành' : 'Tất cả'}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3">
                {filteredReminders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        {filter === 'done' ? 'Chưa có reminder hoàn thành' : 'Không có reminder'}
                    </p>
                ) : (
                    filteredReminders.map((reminder) => (
                        <div
                            key={reminder.id}
                            className={`card p-4 flex items-center gap-4 ${isOverdue(reminder.due_date) ? 'border-red-200 bg-red-50' : ''
                                }`}
                        >
                            <button
                                onClick={() => handleToggleDone(reminder)}
                                disabled={togglingId === reminder.id}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 disabled:opacity-50 ${reminder.is_done
                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : 'border-gray-300 hover:border-primary-500'
                                    }`}
                            >
                                {togglingId === reminder.id ? (
                                    <span className="text-xs animate-spin">⏳</span>
                                ) : (
                                    reminder.is_done && '✓'
                                )}
                            </button>

                            <div className="flex-1 min-w-0">
                                <p className={`font-medium ${reminder.is_done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                    {reminder.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                    👤 {getContactName(reminder.contact_id)}
                                </p>
                            </div>

                            <div className="text-right shrink-0">
                                <p className={`text-sm font-medium ${isOverdue(reminder.due_date) ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                    {new Date(reminder.due_date).toLocaleDateString('vi-VN')}
                                </p>
                                <button
                                    onClick={() => handleDelete(reminder.id)}
                                    disabled={deletingId === reminder.id}
                                    className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
                                >
                                    {deletingId === reminder.id ? 'Đang xóa...' : 'Xóa'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <ReminderModal
                    contacts={contacts}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                    submitting={submitting}
                />
            )}
        </div>
    );
}

function ReminderModal({
    contacts,
    onSave,
    onClose,
    submitting,
}: {
    contacts: Contact[];
    onSave: (data: ReminderFormData) => void;
    onClose: () => void;
    submitting: boolean;
}) {
    const [formData, setFormData] = useState<ReminderFormData>({
        contact_id: '',
        title: '',
        due_date: new Date().toISOString().split('T')[0],
        is_done: false,
    });
    const toast = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.contact_id) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-lg mx-4">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Thêm Reminder mới</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="label">Contact *</label>
                        <select
                            value={formData.contact_id}
                            onChange={e => setFormData({ ...formData, contact_id: e.target.value })}
                            className="input"
                        >
                            <option value="">-- Chọn contact --</option>
                            {contacts.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">Tiêu đề *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="input"
                            placeholder="Follow up báo giá"
                        />
                    </div>
                    <div>
                        <label className="label">Ngày đến hạn *</label>
                        <input
                            type="date"
                            value={formData.due_date}
                            onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                            className="input"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {submitting && <span className="animate-spin inline-block">⏳</span>}
                            {submitting ? 'Đang lưu...' : 'Thêm'}
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
