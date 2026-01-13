import { useState } from "react";
import { supabase } from "./supabase";
import {
  LayoutDashboard,
  FilePlus,
  LogOut,
  Sprout,
  Menu,
  X,
} from "lucide-react";

export function Sidebar({ currentView, setView }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (view) => {
    setView(view);
    setIsOpen(false); // Close menu on selection (mobile)
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <Sprout size={20} color="var(--accent)" />
        <span>FarmerPortal</span>
      </div>
      {/* Mobile Toggle */}
      <button
        className="mobile-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px",
          display: "none",
        }}
      >
        {isOpen ? (
          <X size={22} color="var(--text-primary)" />
        ) : (
          <Menu size={22} color="var(--text-primary)" />
        )}
      </button>

      <style>{`
                /* Desktop / default */
                .nav-container { display: flex; flex-direction: column; width: 100%; flex: 1; }

                @media (max-width: 1024px) {
                    .mobile-toggle { 
                        display: block !important; 
                        z-index: 1001; 
                        position: relative;
                    }
                    /* CRITICAL: Remove nav-container from sidebar layout on mobile */
                    .nav-container { 
                        position: fixed !important;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100vh;
                        background: var(--bg-surface);
                        z-index: 1000;
                        padding: 72px 24px 40px 24px;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: column;
                        /* Animation */
                        opacity: ${isOpen ? 1 : 0};
                        pointer-events: ${isOpen ? "all" : "none"};
                        transform: ${
                          isOpen ? "translateY(0)" : "translateY(-10px)"
                        };
                        transition: opacity 0.3s ease, transform 0.3s ease;
                    }
                    .nav-item {
                        padding: 16px;
                        font-size: 18px;
                        border-bottom: 1px solid var(--border);
                        border-radius: 0;
                        margin-bottom: 0;
                        opacity: ${isOpen ? 1 : 0};
                        transform: ${
                          isOpen ? "translateY(0)" : "translateY(10px)"
                        };
                        transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
                    }
                    .nav-item:first-child { border-top: 1px solid var(--border); }
                    .nav-item:hover { background: var(--bg-page); }
                    /* Hide desktop spacer on mobile */
                    .desktop-spacer { display: none !important; }
                }
            `}</style>

      <div className="nav-container">
        <div style={{ height: "32px" }} className="desktop-spacer"></div>{" "}
        {/* Spacing for desktop */}
        <div
          className={`nav-item ${currentView === "dashboard" ? "active" : ""}`}
          onClick={() => handleNav("dashboard")}
        >
          <div className="nav-icon">
            <LayoutDashboard size={20} />
          </div>
          Dashboard
        </div>
        <div
          className={`nav-item ${currentView === "input" ? "active" : ""}`}
          onClick={() => handleNav("input")}
        >
          <div className="nav-icon">
            <FilePlus size={20} />
          </div>
          New Report
        </div>
        <div style={{ flex: 1 }}></div>
        <div
          className="nav-item"
          style={{ color: "#ef4444", marginTop: "auto" }}
          onClick={() => supabase.auth.signOut()}
        >
          <div className="nav-icon">
            <LogOut size={20} />
          </div>
          Sign Out
        </div>
      </div>
    </div>
  );
}
