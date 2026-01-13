
import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { supabase } from './supabase';
import { vi } from 'vitest';

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockData = [
        {
            id: 1,
            month_date: '2025-01-01',
            farm_area: 10,
            boxes_produced: 1000,
            total_revenue: 5000,
            ghg_emissions_kg: 200,
            ghg_per_box: 0.2,
            revenue_per_hectare: 500,
            water_usage_liters: 10000
        }
    ];

    it('renders loading skeletons initially', () => {
         // Mock unresolving promise to keep it in loading state
         supabase.from.mockReturnValue({ 
            select: vi.fn().mockReturnValue({ 
                order: vi.fn().mockReturnValue(new Promise(() => {})) 
            }) 
        });

        const { container } = render(<Dashboard />);
        // Look for skeleton class
        expect(container.getElementsByClassName('skeleton').length).toBeGreaterThan(0);
    });

    it('renders data after fetch', async () => {
        supabase.from.mockReturnValue({ 
            select: vi.fn().mockReturnValue({ 
                order: vi.fn().mockResolvedValue({ data: mockData, error: null }) 
            }) 
        });

        render(<Dashboard />);

        await waitFor(() => {
            // Check for KPI card value
            expect(screen.getByText('500')).toBeInTheDocument(); // Revenue/ha
            expect(screen.getByText('$ / ha')).toBeInTheDocument();
            
            // Check for table data
            expect(screen.getByText('2025-01-01')).toBeInTheDocument();
            expect(screen.getByText('1,000')).toBeInTheDocument();
        });
    });

    it('handles empty state', async () => {
        supabase.from.mockReturnValue({ 
            select: vi.fn().mockReturnValue({ 
                order: vi.fn().mockResolvedValue({ data: [], error: null }) 
            }) 
        });

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText(/no data available/i)).toBeInTheDocument();
        });
    });

    it('subscribes to realtime updates', async () => {
        const subscribeMock = vi.fn();
        const unsubscribeMock = vi.fn();
        const channelMock = {
            on: vi.fn().mockReturnThis(),
            subscribe: subscribeMock,
            unsubscribe: unsubscribeMock
        };
        // Ensure subscribe returns the channel object (chaining)
        subscribeMock.mockReturnValue(channelMock);
        
        supabase.from.mockReturnValue({ 
            select: vi.fn().mockReturnValue({ 
                order: vi.fn().mockResolvedValue({ data: [], error: null }) 
            }) 
        });
        
        supabase.channel.mockReturnValue(channelMock);

        const { unmount } = render(<Dashboard />);

        expect(supabase.channel).toHaveBeenCalledWith('public:monthly_reports');
        expect(subscribeMock).toHaveBeenCalled();

        unmount();
        expect(unsubscribeMock).toHaveBeenCalled();
    });
});
