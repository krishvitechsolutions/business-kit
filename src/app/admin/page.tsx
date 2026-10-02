'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { storage } from '@/lib/storage';
import { formatINR, formatDate } from '@/lib/utils';
import {
  ShieldAlert,
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Palette,
  Megaphone,
  Mail,
  CheckCircle2,
  Lock,
  Search,
  Sparkles,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminDashboardPage() {
  const { user, isAdmin, toggleAdminMode } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'templates' | 'ads' | 'messages'>('overview');
  const [messages, setMessages] = useState(() => storage.getContactMessages());

  // Demo user data for admin view
  const [usersList, setUsersList] = useState([
    { id: 'usr-1', name: 'Rajesh Sharma', email: 'rajesh@apexinfotech.in', business: 'Apex Infotech', plan: 'pro', docsCount: 28, status: 'Active' },
    { id: 'usr-2', name: 'Vikramjit Singh', email: 'vikram@tripplecraft.in', business: 'TrippleCraft Logistics', plan: 'business', docsCount: 94, status: 'Active' },
    { id: 'usr-3', name: 'Ramesh Patel', email: 'ramesh@patelsarees.com', business: 'Patel Sarees Surat', plan: 'pro', docsCount: 142, status: 'Active' },
    { id: 'usr-4', name: 'Ananya Deshmukh', email: 'ananya.design@freelance.in', business: 'AD Consultancy', plan: 'free', docsCount: 6, status: 'Active' },
    { id: 'usr-5', name: 'Pooja Sundaram', email: 'pooja.s@studio.in', business: 'Sundaram Design Studio', plan: 'free', docsCount: 3, status: 'Active' },
  ]);

  const [adSettings, setAdSettings] = useState({
    enableBanners: true,
    enableLoanPromo: true,
    enableSidebarAd: true,
  });

  const toggleUserPlan = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextPlan = u.plan === 'free' ? 'pro' : u.plan === 'pro' ? 'business' : 'free';
          return { ...u, plan: nextPlan };
        }
        return u;
      })
    );
    confetti({ particleCount: 25, spread: 40 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Platform Admin Master Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            BizTools India Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor real-time platform metrics, manage user subscriptions, document templates, advertisements, and inbound queries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleAdminMode}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
          >
            Switch to Regular User View
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        {[
          { id: 'overview', label: 'Platform Analytics', icon: TrendingUp },
          { id: 'users', label: 'Users & Subscriptions', icon: Users },
          { id: 'templates', label: 'Document Templates', icon: Palette },
          { id: 'ads', label: 'Ads & Promotions', icon: Megaphone },
          { id: 'messages', label: `Contact Inquiries (${messages.length})`, icon: Mail },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Top Platform Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered Users</span>
              <p className="text-3xl font-black text-slate-900">25,840</p>
              <p className="text-[11px] text-emerald-600 font-semibold">+18.4% this month</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Monthly Users</span>
              <p className="text-3xl font-black text-blue-600">14,290</p>
              <p className="text-[11px] text-slate-500">Across 28 Indian States & UTs</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Documents Created</span>
              <p className="text-3xl font-black text-emerald-600">182,450</p>
              <p className="text-[11px] text-slate-500">Invoices, Quotes & Payslips</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Recurring Revenue</span>
              <p className="text-3xl font-black text-purple-700">₹4,82,500</p>
              <p className="text-[11px] text-emerald-600 font-semibold">Pro & Business Subscriptions</p>
            </div>
          </div>

          {/* Tool Usage Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Most Utilized Business Tools</h3>
              <div className="space-y-3">
                {[
                  { tool: 'GST Tax Invoice Maker', count: '94,200', pct: 85 },
                  { tool: 'GST Calculator (Add/Remove)', count: '48,100', pct: 65 },
                  { tool: 'UPI Payment QR Generator', count: '32,500', pct: 50 },
                  { tool: 'Quotation / Estimate Generator', count: '24,300', pct: 40 },
                  { tool: 'Salary Slip Generator', count: '18,200', pct: 30 },
                  { tool: 'WhatsApp Payment Reminder', count: '14,800', pct: 25 },
                ].map((item) => (
                  <div key={item.tool} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>{item.tool}</span>
                      <span className="text-slate-500">{item.count} uses</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Geographical Usage Breakdown (Top States)</h3>
              <div className="space-y-3">
                {[
                  { state: 'Maharashtra (Mumbai / Pune)', users: '32%', color: 'bg-blue-600' },
                  { state: 'Karnataka (Bengaluru)', users: '24%', color: 'bg-indigo-600' },
                  { state: 'Gujarat (Surat / Ahmedabad)', users: '18%', color: 'bg-emerald-600' },
                  { state: 'Delhi NCR', users: '14%', color: 'bg-purple-600' },
                  { state: 'Tamil Nadu & Telangana', users: '12%', color: 'bg-amber-600' },
                ].map((st) => (
                  <div key={st.state} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                    <span className="font-bold text-slate-800">{st.state}</span>
                    <span className="font-mono font-bold text-slate-900">{st.users}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS & SUBSCRIPTIONS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">User Management & Subscription Tiers</h3>
              <p className="text-xs text-slate-500">Click any user plan badge to cycle and test Free → Pro → Business.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 rounded-l-xl">User Name</th>
                  <th className="py-3 px-4">Business</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Documents</th>
                  <th className="py-3 px-4">Subscription Plan</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{u.business}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{u.email}</td>
                    <td className="py-3 px-4 font-bold">{u.docsCount} docs</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleUserPlan(u.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer hover:opacity-80 transition ${
                          u.plan === 'business'
                            ? 'bg-purple-100 text-purple-800'
                            : u.plan === 'pro'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.plan} ⇄ (Change)
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-emerald-600 font-bold">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENT TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Global Document Templates Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { id: 'modern', name: 'Modern Blue Ocean', tier: 'Free & Pro', status: 'Enabled' },
              { id: 'indigo', name: 'Indigo Corporate Slate', tier: 'Pro / Business', status: 'Enabled' },
              { id: 'bordered', name: 'Bordered Gold Legal', tier: 'Pro / Business', status: 'Enabled' },
              { id: 'classic', name: 'Classic Monochromatic', tier: 'Free & Pro', status: 'Enabled' },
              { id: 'minimal', name: 'Minimalist Clean A4', tier: 'Free & Pro', status: 'Enabled' },
            ].map((t) => (
              <div key={t.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    {t.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Tier Availability: {t.tier}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ADS & PROMOTIONS */}
      {activeTab === 'ads' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Ad Placements & Partner Monetization</h3>
          <p className="text-xs text-slate-500">
            Control non-intrusive sponsor slots on free pages (MSME loans, trademark registration). Ads are never shown inside invoices or PDF exports.
          </p>

          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <p className="font-bold text-xs text-slate-900">Content Bottom Banner Ads</p>
                <p className="text-[11px] text-slate-500">Display pro upgrade notices below homepage tools</p>
              </div>
              <input
                type="checkbox"
                checked={adSettings.enableBanners}
                onChange={(e) => setAdSettings({ ...adSettings, enableBanners: e.target.checked })}
                className="w-5 h-5 rounded text-purple-600"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <p className="font-bold text-xs text-slate-900">MSME Loan Partner Banner</p>
                <p className="text-[11px] text-slate-500">Display NBFC loan partner widget on calculators</p>
              </div>
              <input
                type="checkbox"
                checked={adSettings.enableLoanPromo}
                onChange={(e) => setAdSettings({ ...adSettings, enableLoanPromo: e.target.checked })}
                className="w-5 h-5 rounded text-purple-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONTACT INQUIRIES */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Inbound Contact & Support Messages</h3>

          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{msg.name}</h4>
                    <p className="text-xs text-slate-500">
                      {msg.email} | {msg.phone} • <strong className="text-blue-700">{msg.businessType}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{formatDate(msg.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
