import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-gray-100 font-sans antialiased">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FreelanceFlow Tracker. Built for modern freelancers & agencies.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
