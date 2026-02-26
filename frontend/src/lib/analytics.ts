/**
 * SheetCRM Analytics — PostHog integration
 *
 * Setup:
 * 1. pnpm add posthog-js  (run in frontend/)
 * 2. Replace POSTHOG_KEY below with your project key from app.posthog.com
 * 3. Set POSTHOG_HOST if self-hosted, otherwise leave as-is
 */

// Replace with your PostHog project API key
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST as string | undefined ?? 'https://app.posthog.com';

type EventName =
    | 'login'
    | 'logout'
    | 'contact_created'
    | 'contact_updated'
    | 'contact_deleted'
    | 'company_created'
    | 'company_updated'
    | 'company_deleted'
    | 'reminder_created'
    | 'reminder_deleted'
    | 'reminder_toggled'
    | 'page_view';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let posthog: any = null;

export async function initAnalytics() {
    if (!POSTHOG_KEY) return; // silently skip if not configured
    try {
        const { default: ph } = await import('posthog-js');
        ph.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
            capture_pageview: true,
            autocapture: false,
        });
        posthog = ph;
    } catch {
        // posthog-js not installed — ignore
    }
}

export function track(event: EventName, properties?: Record<string, unknown>) {
    posthog?.capture(event, properties);
}

export function identify(email: string, name: string) {
    posthog?.identify(email, { name, email });
}

export function reset() {
    posthog?.reset();
}
