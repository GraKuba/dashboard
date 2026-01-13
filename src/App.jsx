import { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from './supabase';
import { Auth } from './Auth';
import { Sidebar } from './Sidebar';
import { ErrorBoundary } from './ErrorBoundary';
import { Toaster } from 'sonner';
import { UI } from './constants';

// Lazy load heavy components (charts library, etc.)
const Dashboard = lazy(() => import('./Dashboard').then(m => ({ default: m.Dashboard })));
const InputForm = lazy(() => import('./InputForm').then(m => ({ default: m.InputForm })));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="loading-spinner-container">
      Loading...
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState('dashboard'); // dashboard | input
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  if (loadingSession) {
    return (
      <div className="loading-spinner-container">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <ErrorBoundary>
        <Toaster position={UI.TOAST_POSITION} />
        <Auth />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      {/* Skip link for keyboard navigation accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <div className="app-layout">
        <Toaster position={UI.TOAST_POSITION} />
        <Sidebar currentView={view} setView={setView} />
        
        <main id="main-content" className="main-content">
          <div key={view} className="animate-enter">
            <Suspense fallback={<LoadingFallback />}>
              {view === 'dashboard' ? (
                <>
                  <header style={{ marginBottom: '32px' }}>
                    <h1 style={{ margin: 0 }}>Overview</h1>
                  </header>
                  <Dashboard />
                </>
              ) : (
                <InputForm onSaved={() => setView('dashboard')} />
              )}
            </Suspense>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
