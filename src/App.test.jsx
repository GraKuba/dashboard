
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { Sidebar } from './Sidebar';
import { supabase } from './supabase';
import { vi } from 'vitest';

// Mock child components to simplify App testing
vi.mock('./Dashboard', () => ({ Dashboard: () => <div>Dashboard Component</div> }));
vi.mock('./InputForm', () => ({ InputForm: ({ onSaved }) => <div onClick={onSaved}>Input Form Component</div> }));

describe('Sidebar Component', () => {
    it('renders navigation items', () => {
        render(<Sidebar currentView="dashboard" setView={() => {}} />);
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/new report/i)).toBeInTheDocument();
        expect(screen.getByText(/sign out/i)).toBeInTheDocument();
    });

    it('calls setView on click', () => {
        const setViewMock = vi.fn();
        render(<Sidebar currentView="dashboard" setView={setViewMock} />);
        
        fireEvent.click(screen.getByText(/new report/i));
        expect(setViewMock).toHaveBeenCalledWith('input');
    });

    it('calls signOut on click', () => {
        render(<Sidebar currentView="dashboard" setView={() => {}} />);
        fireEvent.click(screen.getByText(/sign out/i));
        expect(supabase.auth.signOut).toHaveBeenCalled();
    });
});

describe('App Integration', () => {
    it('shows loading state initially', () => {
        render(<App />);
        expect(screen.getByText(/loading.../i)).toBeInTheDocument();
    });

    it('renders Auth if no session', async () => {
         supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
         render(<App />);
         
         await waitFor(() => {
             // Auth component (mocked in setupTests as globally mocked? No, integrated here)
             // We didn't mock Auth, so it should render the real one
             expect(screen.getByRole('heading', { name: /farmer portal/i })).toBeInTheDocument();
         });
    });

    it('renders Dashboard if authenticated', async () => {
        const mockSession = { user: { email: 'test@example.com' } };
        supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
        
        render(<App />);
        
        await waitFor(() => {
            expect(screen.getByText('Dashboard Component')).toBeInTheDocument();
        });
    });
    
    it('navigates between views', async () => {
        const mockSession = { user: { email: 'test@example.com' } };
        supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
        
        render(<App />);
        
        await waitFor(() => {
            expect(screen.getByText('Dashboard Component')).toBeInTheDocument();
        });

        // Click New Report in sidebar
        fireEvent.click(screen.getByText(/new report/i));
        expect(screen.getByText('Input Form Component')).toBeInTheDocument();
        expect(screen.queryByText('Dashboard Component')).not.toBeInTheDocument();
    });
});
