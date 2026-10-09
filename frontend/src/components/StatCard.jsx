import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'indigo', trend }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      border: 'border-indigo-500/20',
      glow: 'glow-indigo',
      badge: 'bg-indigo-500/20 text-indigo-300',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      glow: 'glow-emerald',
      badge: 'bg-emerald-500/20 text-emerald-300',
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      glow: 'glow-amber',
      badge: 'bg-amber-500/20 text-amber-300',
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
      glow: '',
      badge: 'bg-purple-500/20 text-purple-300',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className={`glass-card p-6 rounded-2xl border ${scheme.border} glass-card-hover relative overflow-hidden group`}>
      {/* Decorative gradient blur in background */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${scheme.bg} blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl ${scheme.bg} ${scheme.border} border flex items-center justify-center ${scheme.text}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">{subtitle}</span>
        {trend && (
          <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${scheme.badge}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
