import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Receipt,
  Plus
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: Briefcase },
    { label: 'Clients', path: '/clients', icon: Users },
    { label: 'Invoices & Income', path: '/projects', icon: Receipt },
  ];

  const handleOpenNewProject = () => {
    window.dispatchEvent(new CustomEvent('open-project-modal'));
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 bg-transparent px-6 sm:px-8 py-4 flex items-center justify-between">
      {/* Mobile brand & hamburger */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#5347eb] flex items-center justify-center text-white font-bold text-sm">
            T
          </div>
          <span className="font-bold text-slate-900 text-lg">Tally</span>
        </div>
      </div>

      {/* Spacer on Desktop so right profile items align perfectly to right */}
      <div className="hidden md:block flex-1"></div>

      {/* Right User Profile Bar */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {/* Avatar Picture */}
          <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 border border-slate-200 flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
              alt="Alex Morgan"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://ui-avatars.com/api/?name=Alex+Morgan&background=5046e5&color=fff';
              }}
            />
          </div>

          {/* User Details */}
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {user?.name || 'Alex Morgan'}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              {user?.companyName || 'Product Designer'}
            </p>
          </div>
        </div>

        {/* Log out button */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log out</span>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-slate-200 p-4 space-y-2 shadow-lg animate-modal z-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-[#eff0fe] text-[#5046e5] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <div className="pt-2">
            <button
              onClick={handleOpenNewProject}
              className="w-full py-2.5 px-4 rounded-xl bg-[#5046e5] text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Project</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
