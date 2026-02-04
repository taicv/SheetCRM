// Core entity types matching Google Sheets schema

export interface Contact {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    company_id?: string;
    source?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Company {
    id: string;
    name: string;
    industry?: string;
    website?: string;
    address?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Note {
    id: string;
    contact_id: string;
    content: string;
    created_at: string;
}

export interface Reminder {
    id: string;
    contact_id: string;
    title: string;
    due_date: string;
    is_done: boolean;
    created_at: string;
}

// Form types for create/update operations
export type ContactFormData = Omit<Contact, 'id' | 'created_at' | 'updated_at'>;
export type CompanyFormData = Omit<Company, 'id' | 'created_at' | 'updated_at'>;
export type NoteFormData = Omit<Note, 'id' | 'created_at'>;
export type ReminderFormData = Omit<Reminder, 'id' | 'created_at'>;

// API response types
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

// Dashboard stats
export interface DashboardStats {
    totalContacts: number;
    totalCompanies: number;
    upcomingReminders: number;
    recentActivities: Activity[];
}

export interface Activity {
    id: string;
    type: 'contact_added' | 'contact_updated' | 'note_added' | 'reminder_created' | 'company_added';
    description: string;
    created_at: string;
    entity_id: string;
    entity_name: string;
}
