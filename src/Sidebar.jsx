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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="sidebar-brand">
        <Sprout size={20} color="var(--accent)" aria-hidden="true" />
        <span>FarmerPortal</span>
      </div>

      {/* Mobile Toggle */}
      <button
        className="mobile-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="nav-container"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isOpen ? (
          <X size={22} color="var(--text-primary)" aria-hidden="true" />
        ) : (
          <Menu size={22} color="var(--text-primary)" aria-hidden="true" />
        )}
      </button>

      <div
        id="nav-container"
        className={`nav-container ${isOpen ? "open" : "closed"}`}
        role="menu"
      >
        <div className="desktop-spacer" aria-hidden="true"></div>

        <button
          type="button"
          role="menuitem"
          className={`nav-item ${currentView === "dashboard" ? "active" : ""}`}
          onClick={() => handleNav("dashboard")}
          aria-current={currentView === "dashboard" ? "page" : undefined}
        >
          <span className="nav-icon" aria-hidden="true">
            <LayoutDashboard size={20} />
          </span>
          Dashboard
        </button>

        <button
          type="button"
          role="menuitem"
          className={`nav-item ${currentView === "input" ? "active" : ""}`}
          onClick={() => handleNav("input")}
          aria-current={currentView === "input" ? "page" : undefined}
        >
          <span className="nav-icon" aria-hidden="true">
            <FilePlus size={20} />
          </span>
          New Report
        </button>

        <div style={{ flex: 1 }} aria-hidden="true"></div>

        <button
          type="button"
          role="menuitem"
          className="nav-item nav-item-danger"
          onClick={handleSignOut}
        >
          <span className="nav-icon" aria-hidden="true">
            <LogOut size={20} />
          </span>
          Sign Out
        </button>
      </div>
    </nav>
  );
}
