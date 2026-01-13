
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { Auth } from './Auth'
import { Dashboard } from './Dashboard'
import { InputForm } from './InputForm'
import { Sidebar } from './Sidebar'

import { Toaster } from 'sonner'

function App() {
  const [session, setSession] = useState(null)
  const [view, setView] = useState('dashboard') // dashboard | input
  const [loadingSession, setLoadingSession] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoadingSession(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoadingSession(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  if (loadingSession) {
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#635bff' }}>Loading...</div>
  }

  if (!session) {
    return (
      <>
        <Toaster position="top-right" />
        <Auth />
      </>
    )
  }

  return (
    <div className="app-layout">
        <Toaster position="top-right" />
        <Sidebar currentView={view} setView={setView} />
        
        <div className="main-content">
            <div key={view} className="animate-enter">
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
            </div>
        </div>
    </div>
  )
}

export default App
