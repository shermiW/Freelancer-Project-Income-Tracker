import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Receipt, 
  Plus
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: Briefcase },
    { label: 'Clients', path: '/clients', icon: Users },
    { label: 'Invoices & Income', path: '/projects', icon: Receipt },
  ];

  const handleOpenNewProject = () => {
    window.dispatchEvent(new CustomEvent('open-project-modal'));
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between hidden md:flex min-h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand Header: Purple 'F' Badge + 'Freelancer Tracker' */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#5347eb] flex items-center justify-center text-white font-bold text-base shadow-sm shadow-indigo-500/20">
            F
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Freelancer Tracker
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 py-2 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) => {
                  // Only treat as active if exact match for dashboard or projects
                  const active = item.label === 'Dashboard' 
                    ? isActive 
                    : item.label === 'Invoices & Income' 
                      ? false 
                      : isActive;

                  return `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-[#eff0fe] text-[#5046e5] font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`;
                }}
              >
                {({ isActive }) => {
                  const active = item.label === 'Dashboard' 
                    ? isActive 
                    : item.label === 'Invoices & Income' 
                      ? false 
                      : isActive;
                  return (
                    <>
                      <Icon className={`w-4 h-4 ${active ? 'text-[#5046e5]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </>
                  );
                }}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Button: + New Project */}
      <div className="p-4">
        <button
          onClick={handleOpenNewProject}
          className="w-full py-3 px-4 rounded-xl bg-[#5046e5] hover:bg-[#4338ca] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
