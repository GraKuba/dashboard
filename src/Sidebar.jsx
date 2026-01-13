
import { supabase } from './supabase';
import { LayoutDashboard, FilePlus, LogOut, Sprout } from 'lucide-react';

export function Sidebar({ currentView, setView }) {
    return (
        <div className="sidebar">
            <div className="sidebar-brand">
                <Sprout size={28} color="var(--accent)" style={{ marginRight: '10px' }} />
                <span>FarmerPortal</span>
            </div>
            
            <div 
                className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => setView('dashboard')}
            >
                <div className="nav-icon">
                    <LayoutDashboard size={20} />
                </div>
                Dashboard
            </div>
            
            <div 
                className={`nav-item ${currentView === 'input' ? 'active' : ''}`}
                onClick={() => setView('input')}
            >
                <div className="nav-icon">
                    <FilePlus size={20} />
                </div>
                New Report
            </div>
            
            <div style={{ flex: 1 }}></div>

            <div 
                className="nav-item"
                style={{ color: '#ef4444' }}
                onClick={() => supabase.auth.signOut()}
            >
                <div className="nav-icon">
                    <LogOut size={20} />
                </div>
                Sign Out
            </div>
        </div>
    );
}
