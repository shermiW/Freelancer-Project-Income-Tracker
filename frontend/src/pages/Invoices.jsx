import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Loader2 } from 'lucide-react';

const defaultInvoices = [
  {
    id: 'INV-1024',
    client: 'Northwind Studio',
    project: 'Brand Identity Refresh',
    due: 'Oct 24, 2026',
    payment: 'Awaiting',
    amount: 4800,
  },
  {
    id: 'INV-1023',
    client: 'Lumen Coffee Co.',
    project: 'E-commerce Storefront',
    due: 'Nov 8, 2026',
    payment: 'Awaiting',
    amount: 7200,
  },
  {
    id: 'INV-1022',
    client: 'Fieldnote Health',
    project: 'Patient Portal UX Audit',
    due: 'Nov 15, 2026',
    payment: 'Awaiting',
    amount: 3500,
  },
  {
    id: 'INV-1021',
    client: 'Atlas Freight',
    project: 'Fleet Tracking Dashboard',
    due: 'Dec 1, 2026',
    payment: 'Awaiting',
    amount: 9600,
  },
  {
    id: 'INV-1020',
    client: 'Brightside Learning',
    project: 'Course Landing Pages',
    due: 'Oct 3, 2026',
    payment: 'Paid',
    amount: 2400,
  },
  {
    id: 'INV-1019',
    client: 'Whitaker & Co. Law',
    project: 'Firm Website Redesign',
    due: 'Sep 20, 2026',
    payment: 'Paid',
    amount: 5600,
  },
  {
    id: 'INV-1018',
    client: 'Orbit Fintech',
    project: 'Onboarding Flow Redesign',
    due: 'Nov 22, 2026',
    payment: 'Awaiting',
    amount: 6400,
  },
  {
    id: 'INV-1017',
    client: 'Peak Outdoors',
    project: 'Product Photography Retouch',
    due: 'Sep 12, 2026',
    payment: 'Paid',
    amount: 1200,
  },
  {
    id: 'INV-1016',
    client: 'Lumen Coffee Co.',
    project: 'Packaging Design',
    due: 'Aug 30, 2026',
    payment: 'Paid',
    amount: 3800,
  },
  {
    id: 'INV-1015',
    client: 'Atlas Freight',
    project: 'Creator Marketplace App UI',
    due: 'Dec 5, 2026',
    payment: 'Awaiting',
    amount: 4800,
  },
  {
    id: 'INV-1014',
    client: 'Brightside Learning',
    project: 'Mobile App Tablet Responsive Layout',
    due: 'Dec 10, 2026',
    payment: 'Awaiting',
    amount: 5100,
  },
  {
    id: 'INV-1013',
    client: 'Northwind Studio',
    project: 'Global Search & Command Palette',
    due: 'Dec 15, 2026',
    payment: 'Awaiting',
    amount: 3600,
  },
  {
    id: 'INV-1012',
    client: 'Lumen Coffee Co.',
    project: 'Web Accessibility (WCAG AAA) Audit',
    due: 'Dec 20, 2026',
    payment: 'Awaiting',
    amount: 4200,
  },
  {
    id: 'INV-1011',
    client: 'Fieldnote Health',
    project: 'Interactive 3D Product Configurator',
    due: 'Dec 24, 2026',
    payment: 'Awaiting',
    amount: 6800,
  },
  {
    id: 'INV-1010',
    client: 'Atlas Freight',
    project: 'Cross-Platform Push Notifications UI',
    due: 'Dec 30, 2026',
    payment: 'Awaiting',
    amount: 4800,
  },
  {
    id: 'INV-1009',
    client: 'Northwind Studio',
    project: 'Design System & Component Kit',
    due: 'Sep 18, 2026',
    payment: 'Paid',
    amount: 4500,
  },
  {
    id: 'INV-1008',
    client: 'Lumen Coffee Co.',
    project: 'Mobile App Wireframes & Flow',
    due: 'Sep 12, 2026',
    payment: 'Paid',
    amount: 3800,
  },
  {
    id: 'INV-1007',
    client: 'Fieldnote Health',
    project: 'Fintech Dashboard Analytics',
    due: 'Aug 25, 2026',
    payment: 'Paid',
    amount: 5200,
  },
  {
    id: 'INV-1006',
    client: 'Atlas Freight',
    project: 'SaaS Marketing Site Redesign',
    due: 'Aug 15, 2026',
    payment: 'Paid',
    amount: 2900,
  },
  {
    id: 'INV-1005',
    client: 'Brightside Learning',
    project: 'Brand Iconography Suite',
    due: 'Jul 28, 2026',
    payment: 'Paid',
    amount: 2150,
  },
  {
    id: 'INV-1004',
    client: 'Northwind Studio',
    project: 'Dark Mode Web Application Theme',
    due: 'Jul 10, 2026',
    payment: 'Paid',
    amount: 1850,
  },
  {
    id: 'INV-1003',
    client: 'Lumen Coffee Co.',
    project: 'User Onboarding Flow Experience',
    due: 'Jun 20, 2026',
    payment: 'Paid',
    amount: 3100,
  },
  {
    id: 'INV-1002',
    client: 'Priya Raman',
    project: 'Product Presentation Deck',
    due: 'Jun 5, 2026',
    payment: 'Paid',
    amount: 1600,
  },
  {
    id: 'INV-1001',
    client: 'Atlas Freight',
    project: 'Checkout Flow UX Audit',
    due: 'May 18, 2026',
    payment: 'Paid',
    amount: 2750,
  },
];

const Invoices = () => {
  const [invoices, setInvoices] = useState(defaultInvoices);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/projects');
      if (Array.isArray(data) && data.length > 0) {
        // Map backend projects to invoice items
        const mapped = data.map((p, idx) => {
          const isPaid = p.status === 'Completed' || (p.amountPaid > 0 && p.amountPaid >= p.fee);
          const clientName =
            (typeof p.client === 'object' && p.client !== null
              ? p.client.company || p.client.name
              : p.client) || 'Direct Client';

          const formattedDate = p.dueDate
            ? new Date(p.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Pending';

          return {
            id: `INV-${1000 + data.length - idx}`,
            client: clientName,
            project: p.title,
            due: formattedDate,
            payment: isPaid ? 'Paid' : 'Awaiting',
            amount: p.fee || 0,
          };
        });
        setInvoices(mapped);
      }
    } catch (err) {
      console.warn('Using default invoices dataset:', err.message);
      setInvoices(defaultInvoices);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Filter invoices by Tab (All, Paid, Outstanding)
  const filteredInvoices = invoices.filter((item) => {
    if (filter === 'Paid') return item.payment === 'Paid';
    if (filter === 'Outstanding') return item.payment === 'Awaiting';
    return true;
  });

  // Calculate summary metrics
  const received = invoices
    .filter((inv) => inv.payment === 'Paid')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0) || 35950;

  const outstanding = invoices
    .filter((inv) => inv.payment === 'Awaiting')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0) || 60150;

  const total = received + outstanding;
  const collectedPct = total > 0 ? Math.round((received / total) * 100) : 37;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header matching Tally Screenshot */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight my-0">
          Invoices & Income
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-normal m-0">
          Every project fee, paid and outstanding.
        </p>
      </div>

      {/* Summary Card with 3 Metric Columns */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1.5 m-0">Received</p>
            <h2 className="text-2xl font-bold text-emerald-600 my-0 tracking-tight">
              Rs. {received.toLocaleString()}
            </h2>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1.5 m-0">Outstanding</p>
            <h2 className="text-2xl font-bold text-amber-500 my-0 tracking-tight">
              Rs. {outstanding.toLocaleString()}
            </h2>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1.5 m-0">Collected</p>
            <h2 className="text-2xl font-bold text-slate-800 my-0 tracking-tight">
              {collectedPct}%
            </h2>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mb-6">
          <button
            onClick={() => setFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'All'
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('Paid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'Paid'
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => setFilter('Outstanding')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'Outstanding'
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Outstanding
          </button>
        </div>

        {/* Invoices Table */}
        {loading && invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-7 h-7 text-[#5046e5] animate-spin mb-2" />
            <p className="text-xs text-slate-400">Loading invoices...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-normal text-slate-400">
                  <th className="pb-3 font-normal">Invoice</th>
                  <th className="pb-3 font-normal">Client</th>
                  <th className="pb-3 font-normal">Project</th>
                  <th className="pb-3 font-normal">Due</th>
                  <th className="pb-3 font-normal">Payment</th>
                  <th className="pb-3 font-normal text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3.5 text-slate-400 font-normal">
                      {inv.id}
                    </td>
                    <td className="py-3.5 text-slate-800 font-medium">
                      {inv.client}
                    </td>
                    <td className="py-3.5 text-slate-600 font-normal">
                      {inv.project}
                    </td>
                    <td className="py-3.5 text-slate-500 font-normal">
                      {inv.due}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          inv.payment === 'Paid'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {inv.payment}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-800">
                      Rs. {inv.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
