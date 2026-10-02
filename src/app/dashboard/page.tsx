'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { storage } from '@/lib/storage';
import { Invoice, DocumentStatus } from '@/lib/types';
import { formatINR, formatDate } from '@/lib/utils';
import {
  FileText,
  FileCheck,
  Building2,
  Receipt,
  CreditCard,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Copy,
  Printer,
  Download,
  Plus,
  ArrowRight,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportElementToPDF } from '@/lib/pdf';
import InvoiceTemplate from '@/components/documents/InvoiceTemplate';

export default function DashboardPage() {
  const { user, businessProfile } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<Invoice | null>(null);

  useEffect(() => {
    setInvoices(storage.getInvoices());
  }, []);

  // Compute stats
  const totalInvoices = invoices.length;
  const thisMonthInvoices = invoices.filter((inv) => {
    const d = new Date(inv.invoiceDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const totalInvoiceValue = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
  const pendingPaymentsValue = invoices
    .filter((inv) => inv.status === 'unpaid' || inv.status === 'sent')
    .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

  const handleDelete = (id: string) => {
    storage.deleteInvoice(id);
    setInvoices(storage.getInvoices());
  };

  const handleDuplicate = (inv: Invoice) => {
    const dup: Invoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.saveInvoice(dup);
    setInvoices(storage.getInvoices());
    confetti({ particleCount: 30, spread: 45 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold border border-blue-400/30">
              🇮🇳 Business Dashboard
            </span>
            <span className="text-xs text-emerald-300 font-semibold uppercase">{user?.plan || 'Free'} Plan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {businessProfile.businessName || 'Business Owner'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100">
            GSTIN: <span className="font-mono font-bold text-white">{businessProfile.gstin || 'Unregistered'}</span> | {businessProfile.city}, {businessProfile.state}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/profile"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
          >
            Edit Profile & GST
          </Link>
          <Link
            href="/gst-invoice-generator"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Documents</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalInvoices + 5}</p>
          <p className="text-[11px] text-slate-500">Invoices, Quotes, POs & Payslips</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">This Month Invoices</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600">{thisMonthInvoices}</p>
          <p className="text-[11px] text-slate-500">Generated in current billing cycle</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Invoice Value</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700">{formatINR(totalInvoiceValue)}</p>
          <p className="text-[11px] text-slate-500">Cumulative billed revenue</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Receivables</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600">{formatINR(pendingPaymentsValue)}</p>
          <p className="text-[11px] text-slate-500">Unpaid / awaiting client transfer</p>
        </div>
      </div>

      {/* Create Document Action Tiles */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span>Quick Document Generators</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'GST Invoice', href: '/gst-invoice-generator', icon: FileText, color: 'bg-blue-600' },
            { name: 'Quotation', href: '/quotation-maker', icon: FileCheck, color: 'bg-indigo-600' },
            { name: 'Purchase Order', href: '/purchase-order-generator', icon: Building2, color: 'bg-slate-800' },
            { name: 'Payment Receipt', href: '/receipt-generator', icon: Receipt, color: 'bg-teal-600' },
            { name: 'Salary Slip', href: '/salary-slip-generator', icon: CreditCard, color: 'bg-sky-600' },
            { name: 'Business Card', href: '/business-card-maker', icon: Sparkles, color: 'bg-pink-600' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition flex flex-col items-center text-center space-y-2.5 group"
              >
                <div className={`w-11 h-11 rounded-xl ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs text-slate-800 group-hover:text-blue-600">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Documents Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Invoices & Documents</h2>
            <p className="text-xs text-slate-500">Manage, edit, duplicate, or export your saved business records.</p>
          </div>
          <Link
            href="/my-documents"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All in Library</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-3 rounded-l-xl">Document No</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Customer Name</th>
                <th className="py-3 px-3 text-right">Grand Total (₹)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-bold text-slate-900 font-mono">{inv.invoiceNumber}</td>
                  <td className="py-3 px-3 text-slate-500">{formatDate(inv.invoiceDate)}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{inv.customerName}</td>
                  <td className="py-3 px-3 text-right font-black text-slate-900">{formatINR(inv.grandTotal)}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'sent'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedInvoiceForModal(inv)}
                      className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                      title="Quick Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(inv)}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                      title="Duplicate Record"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                      title="Delete Invoice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Preview Modal */}
      {selectedInvoiceForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Invoice Preview — {selectedInvoiceForModal.invoiceNumber}
              </h3>
              <button
                onClick={() => setSelectedInvoiceForModal(null)}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold"
              >
                Close (ESC)
              </button>
            </div>

            <div className="flex justify-center">
              <InvoiceTemplate invoice={selectedInvoiceForModal} id="modal-invoice-doc" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
