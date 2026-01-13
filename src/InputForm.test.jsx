
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InputForm } from './InputForm';
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

describe('InputForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Clear local storage
        localStorage.clear();
    });

    it('renders all form sections', () => {
        render(<InputForm />);
        expect(screen.getByText(/report details/i)).toBeInTheDocument();
        expect(screen.getByText(/save report/i)).toBeInTheDocument();
    });

    it('validates negative numbers', async () => {
        render(<InputForm />);
        
        // Mock supabase
        supabase.from.mockReturnValue({ insert: vi.fn() });

        const input = screen.getByLabelText(/total boxes produced/i);
        
        // JSDOM workaround
        fireEvent.change(input, { target: { type: 'text' } });
        fireEvent.change(input, { target: { value: '-10' } });
        
        const form = input.closest('form');
        fireEvent.submit(form);

        expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('cannot be negative'));
        expect(supabase.from).not.toHaveBeenCalled();
    });

    it('submits valid data successfully', async () => {
        const onSavedMock = vi.fn();
        render(<InputForm onSaved={onSavedMock} />);
        
        const insertMock = vi.fn().mockResolvedValue({ error: null });
        supabase.from.mockReturnValue({ insert: insertMock });

        const dateInput = screen.getByLabelText(/month/i);
        fireEvent.change(dateInput, { target: { value: '2025-01-01' } }); 

        const boxInput = screen.getByLabelText(/total boxes produced/i);
        await fireEvent.change(boxInput, { target: { value: '1000' } });

        const form = screen.getByLabelText(/total boxes produced/i).closest('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(insertMock).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('saved successfully'));
            expect(onSavedMock).toHaveBeenCalled();
        });
    });

    it('handles submission error', async () => {
        render(<InputForm />);
        
        const insertMock = vi.fn().mockResolvedValue({ error: { message: 'Database error' } });
        supabase.from.mockReturnValue({ insert: insertMock });

        const form = screen.getByLabelText(/total boxes produced/i).closest('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Database error'));
        });
    });
    
    it('restores draft from localStorage', () => {
        const draft = JSON.stringify({ boxes_produced: '999' });
        localStorage.setItem('monthly_report_draft', draft);
        
        render(<InputForm />);
        
        expect(screen.getByDisplayValue('999')).toBeInTheDocument();
        expect(toast.info).toHaveBeenCalledWith(expect.stringContaining('Restored draft'));
    });
});
