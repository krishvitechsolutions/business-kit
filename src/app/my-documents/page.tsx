'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { Invoice, Quotation, PurchaseOrder, Receipt, SalarySlip, DeliveryChallan } from '@/lib/types';
import { formatINR, formatDate } from '@/lib/utils';
import {
  FolderOpen,
  FileText,
  FileCheck,
  Building2,
  Receipt as ReceiptIcon,
  CreditCard,
  Truck,
  Search,
  Eye,
  Trash2,
  Copy,
  Plus,
  ArrowRight,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import InvoiceTemplate from '@/components/documents/InvoiceTemplate';
import QuotationTemplate from '@/components/documents/QuotationTemplate';
import PurchaseOrderTemplate from '@/components/documents/PurchaseOrderTemplate';
import ReceiptTemplate from '@/components/documents/ReceiptTemplate';
import SalarySlipTemplate from '@/components/documents/SalarySlipTemplate';
import DeliveryChallanTemplate from '@/components/documents/DeliveryChallanTemplate';

export default function MyDocumentsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'invoices' | 'quotations' | 'challans' | 'pos' | 'receipts' | 'salary_slips'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [challans, setChallans] = useState<DeliveryChallan[]>([]);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>([]);

  // Preview Modal
  const [previewDoc, setPreviewDoc] = useState<{ type: string; data: any } | null>(null);

  const loadDocs = () => {
    setInvoices(storage.getInvoices());
    setQuotations(storage.getQuotations());
    setChallans(storage.getDeliveryChallans());
    setPos(storage.getPurchaseOrders());
    setReceipts(storage.getReceipts());
    setSalarySlips(storage.getSalarySlips());
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleDelete = (type: string, id: string) => {
    if (type === 'invoice') storage.deleteInvoice(id);
    if (type === 'quotation') storage.deleteQuotation(id);
    if (type === 'challan') storage.deleteDeliveryChallan(id);
    if (type === 'po') storage.deletePurchaseOrder(id);
    if (type === 'receipt') storage.deleteReceipt(id);
    if (type === 'salary_slip') storage.deleteSalarySlip(id);
    loadDocs();
  };

  // Build Unified Documents List
  const unifiedDocs = [
    ...invoices.map((i) => ({
      id: i.id,
      docNo: i.invoiceNumber,
      type: 'Invoice',
      category: 'invoice',
      name: i.customerName,
      date: i.invoiceDate,
      amount: i.grandTotal,
      status: i.status,
      rawData: i,
    })),
    ...quotations.map((q) => ({
      id: q.id,
      docNo: q.quotationNumber,
      type: 'Quotation',
      category: 'quotation',
      name: q.customerName,
      date: q.date,
      amount: q.grandTotal,
      status: q.status,
      rawData: q,
    })),
    ...challans.map((c) => ({
      id: c.id,
      docNo: c.challanNumber,
      type: 'Delivery Challan',
      category: 'challan',
      name: `${c.consigneeName} (${c.reasonForTransportation})`,
      date: c.challanDate,
      amount: c.grandTotal,
      status: c.status,
      rawData: c,
    })),
    ...pos.map((p) => ({
      id: p.id,
      docNo: p.poNumber,
      type: 'Purchase Order',
      category: 'po',
      name: p.supplierName,
      date: p.date,
      amount: p.grandTotal,
      status: p.status,
      rawData: p,
    })),
    ...receipts.map((r) => ({
      id: r.id,
      docNo: r.receiptNumber,
      type: 'Receipt',
      category: 'receipt',
      name: r.customerName,
      date: r.date,
      amount: r.amountReceived,
      status: 'paid',
      rawData: r,
    })),
    ...salarySlips.map((s) => ({
      id: s.id,
      docNo: s.slipNumber,
      type: 'Salary Slip',
      category: 'salary_slip',
      name: `${s.employeeName} (${s.month})`,
      date: s.payDate,
      amount: s.netSalary,
      status: 'paid',
      rawData: s,
    })),
  ];

  const filteredDocs = unifiedDocs.filter((doc) => {
    if (activeTab !== 'all' && doc.category !== activeTab.slice(0, -1) && doc.category !== activeTab) {
      if (activeTab === 'invoices' && doc.category !== 'invoice') return false;
      if (activeTab === 'quotations' && doc.category !== 'quotation') return false;
      if (activeTab === 'challans' && doc.category !== 'challan') return false;
      if (activeTab === 'pos' && doc.category !== 'po') return false;
      if (activeTab === 'receipts' && doc.category !== 'receipt') return false;
      if (activeTab === 'salary_slips' && doc.category !== 'salary_slip') return false;
    }
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return doc.docNo.toLowerCase().includes(term) || doc.name.toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <FolderOpen className="w-4 h-4" />
            <span>Document Management System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Business Documents Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Search, filter, preview and manage all your saved invoices, quotations, purchase orders, receipts, and payslips.
          </p>
        </div>

        <Link
          href="/gst-invoice-generator"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'invoices', label: 'Invoices' },
            { id: 'quotations', label: 'Quotations' },
            { id: 'challans', label: 'Delivery Challans' },
            { id: 'pos', label: 'POs' },
            { id: 'receipts', label: 'Receipts' },
            { id: 'salary_slips', label: 'Salary Slips' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="sent">Sent</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Document Ref</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Recipient / Employee</th>
                <th className="py-3 px-4 text-right">Value (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No documents found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold">
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">{doc.docNo}</td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{formatDate(doc.date)}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs truncate">{doc.name}</td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">{formatINR(doc.amount)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          doc.status === 'paid' || doc.status === 'issued'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'sent' || doc.status === 'unpaid'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setPreviewDoc({ type: doc.category, data: doc.rawData })}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.category, doc.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document View Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 uppercase text-xs">
                Document Preview
              </h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold"
              >
                Close (ESC)
              </button>
            </div>

            <div className="flex justify-center">
              {previewDoc.type === 'invoice' && <InvoiceTemplate invoice={previewDoc.data} />}
              {previewDoc.type === 'quotation' && <QuotationTemplate quotation={previewDoc.data} />}
              {previewDoc.type === 'challan' && <DeliveryChallanTemplate challan={previewDoc.data} />}
              {previewDoc.type === 'po' && <PurchaseOrderTemplate po={previewDoc.data} />}
              {previewDoc.type === 'receipt' && <ReceiptTemplate receipt={previewDoc.data} />}
              {previewDoc.type === 'salary_slip' && <SalarySlipTemplate slip={previewDoc.data} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
