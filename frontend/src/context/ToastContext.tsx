import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const STYLES: Record<ToastType, { bg: string; icon: string }> = {
    success: { bg: 'bg-emerald-500', icon: '✓' },
    error:   { bg: 'bg-red-500',     icon: '✕' },
    warning: { bg: 'bg-amber-500',   icon: '⚠' },
    info:    { bg: 'bg-blue-500',    icon: 'ℹ' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    }, [removeToast]);

    const success = useCallback((msg: string) => addToast(msg, 'success'), [addToast]);
    const error   = useCallback((msg: string) => addToast(msg, 'error'),   [addToast]);
    const warning = useCallback((msg: string) => addToast(msg, 'warning'), [addToast]);
    const info    = useCallback((msg: string) => addToast(msg, 'info'),    [addToast]);

    return (
        <ToastContext.Provider value={{ success, error, warning, info }}>
            {children}
            {/* Toast container — top-right, above everything */}
            <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-80 pointer-events-none">
                {toasts.map((toast) => {
                    const { bg, icon } = STYLES[toast.type];
                    return (
                        <div
                            key={toast.id}
                            className={`${bg} text-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 pointer-events-auto`}
                        >
                            <span className="font-bold text-base shrink-0">{icon}</span>
                            <span className="flex-1 text-sm">{toast.message}</span>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-white/70 hover:text-white font-bold text-xl leading-none shrink-0"
                                aria-label="Đóng"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
