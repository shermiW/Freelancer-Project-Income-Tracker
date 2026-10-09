import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Sparkles,
  Building2
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'Dashboard Overview', desc: 'Real-time analytics and financial summary' };
      case '/projects':
        return { title: 'Projects Management', desc: 'Track project milestones, fees, and statuses' };
      case '/clients':
        return { title: 'Clients Directory', desc: 'Manage client contacts and account relationships' };
      default:
        return { title: 'Freelancer Portal', desc: 'Track income & manage client projects' };
    }
  };

  const pageInfo = getPageTitle();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: Briefcase },
    { label: 'Clients', path: '/clients', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-20 glass-panel border-b border-slate-800/80 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Mobile menu toggle + Page title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg md:hidden hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight my-0 flex items-center gap-2">
              {pageInfo.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">{pageInfo.desc}</p>
          </div>
        </div>

        {/* Right: Quick User Info & Actions */}
        <div className="flex items-center gap-4">
          {user?.companyName && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{user.companyName}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-200">{user?.name}</p>
              <p className="text-[10px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Freelancer
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-rose-400 bg-slate-800/60 hover:bg-rose-500/10 border border-slate-700/60 hover:border-rose-500/30 rounded-lg transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-2 border-t border-slate-800 mt-4 space-y-2 animate-modal">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
