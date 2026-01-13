
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Auth } from './Auth';
import { supabase } from './supabase';
import { toast } from 'sonner';
import { vi } from 'vitest';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Auth Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ... (tests for rendering match previous logic, assuming unchanged) ...
    it('renders login form by default', () => {
        render(<Auth />);
        expect(screen.getByRole('heading', { name: /farmer portal/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('toggles to sign up mode', () => {
        render(<Auth />);
        const toggleBtn = screen.getByText(/sign up/i);
        fireEvent.click(toggleBtn);
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('handles login submission', async () => {
        render(<Auth />);
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
        
        supabase.auth.signInWithPassword.mockResolvedValue({ error: null });
        
        const form = screen.getByPlaceholderText(/email/i).closest('form');
        fireEvent.submit(form);
        
        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });

    it('handles sign up submission with options', async () => {
        render(<Auth />);
        fireEvent.click(screen.getByText(/sign up/i));

        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'new@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });

        supabase.auth.signUp.mockResolvedValue({ error: null });

        const form = screen.getByPlaceholderText(/email/i).closest('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'new@example.com',
                password: 'password123',
                // Check for dynamic origin in options roughly or mock window.location
                options: expect.objectContaining({ emailRedirectTo: expect.stringContaining('http') })
            });
        });
        
        expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Check your email'));
    });

    it('displays error on failure', async () => {
        render(<Auth />);
        
        supabase.auth.signInWithPassword.mockResolvedValue({ error: { message: 'Invalid login' } });

        // Submit form directly
        const form = screen.getByPlaceholderText(/email/i).closest('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Invalid login');
        });
    });
});
