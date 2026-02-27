import type {
    Contact,
    Company,
    Note,
    Reminder,
    Deal,
    ContactFormData,
    CompanyFormData,
    NoteFormData,
    ReminderFormData,
    DealFormData,
    DashboardStats
} from '@/types';

const API_BASE = '/api/v1';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        credentials: 'include', // Send cookies for auth
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (response.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = '/';
        throw new Error('Session expired. Please sign in again.');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// Contacts API
export const contactsApi = {
    getAll: () => fetchApi<Contact[]>('/contacts'),

    getById: (id: string) => fetchApi<Contact>(`/contacts/${id}`),

    create: (data: ContactFormData) =>
        fetchApi<Contact>('/contacts', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<ContactFormData>) =>
        fetchApi<Contact>(`/contacts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<{ success: boolean }>(`/contacts/${id}`, {
            method: 'DELETE',
        }),

    getNotes: (contactId: string) =>
        fetchApi<Note[]>(`/contacts/${contactId}/notes`),

    addNote: (contactId: string, data: Omit<NoteFormData, 'contact_id'>) =>
        fetchApi<Note>(`/contacts/${contactId}/notes`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};

// Companies API
export const companiesApi = {
    getAll: () => fetchApi<Company[]>('/companies'),

    getById: (id: string) => fetchApi<Company>(`/companies/${id}`),

    create: (data: CompanyFormData) =>
        fetchApi<Company>('/companies', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<CompanyFormData>) =>
        fetchApi<Company>(`/companies/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<{ success: boolean }>(`/companies/${id}`, {
            method: 'DELETE',
        }),

    getContacts: (companyId: string) =>
        fetchApi<Contact[]>(`/companies/${companyId}/contacts`),
};

// Reminders API
export const remindersApi = {
    getAll: (params?: { due_before?: string }) => {
        const query = params?.due_before ? `?due_before=${params.due_before}` : '';
        return fetchApi<Reminder[]>(`/reminders${query}`);
    },

    create: (data: ReminderFormData) =>
        fetchApi<Reminder>('/reminders', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<ReminderFormData>) =>
        fetchApi<Reminder>(`/reminders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<{ success: boolean }>(`/reminders/${id}`, {
            method: 'DELETE',
        }),

    markDone: (id: string) =>
        fetchApi<Reminder>(`/reminders/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ is_done: true }),
        }),
};

// Deals API
export const dealsApi = {
    getAll: () => fetchApi<Deal[]>('/deals'),

    getById: (id: string) => fetchApi<Deal>(`/deals/${id}`),

    create: (data: DealFormData) =>
        fetchApi<Deal>('/deals', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<DealFormData>) =>
        fetchApi<Deal>(`/deals/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<{ success: boolean }>(`/deals/${id}`, {
            method: 'DELETE',
        }),
};

// Dashboard API
export const dashboardApi = {
    getStats: () => fetchApi<DashboardStats>('/dashboard/stats'),
};
