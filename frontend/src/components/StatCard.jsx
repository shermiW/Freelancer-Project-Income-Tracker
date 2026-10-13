import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo',
  trend,
  trendLabel = 'vs last month',
}) => {
  const colorMap = {
    emerald: {
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      valueColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-600',
    },
    amber: {
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      valueColor: 'text-amber-600',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-600',
    },
    indigo: {
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
      valueColor: 'text-indigo-600',
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-600',
    },
    blue: {
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      valueColor: 'text-blue-600',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-600',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between">
      {/* Top Header Row: Title & Colored Icon Badge */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 tracking-tight">{title}</span>
        <div className={`w-9 h-9 rounded-xl ${scheme.iconBg} ${scheme.iconColor} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="my-3">
        <h3 className={`text-3xl font-extrabold ${scheme.valueColor} tracking-tight leading-none`}>
          {value}
        </h3>
      </div>

      {/* Bottom Subtitle & Trend */}
      <div className="flex items-center gap-2 text-xs">
        {trend ? (
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold ${scheme.badgeBg} ${scheme.badgeText}`}>
              {trend}
            </span>
            {trendLabel && <span className="text-slate-400 font-medium">{trendLabel}</span>}
          </div>
        ) : (
          <span className="text-slate-400 font-medium">{subtitle}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
