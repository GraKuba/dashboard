
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Supabase globally
vi.mock('./supabase', () => ({
    supabase: {
        from: vi.fn(),
        auth: {
            signUp: vi.fn(),
            signInWithPassword: vi.fn(),
            getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
            onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
            signOut: vi.fn(),
        },
        channel: vi.fn(() => {
            const channel = {
                on: vi.fn().mockReturnThis(),
                subscribe: vi.fn().mockReturnThis(),
                unsubscribe: vi.fn(),
            };
            return channel;
        }),
    },
}));

// Mock ResizeObserver for Recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
