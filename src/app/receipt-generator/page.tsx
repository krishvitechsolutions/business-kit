'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Receipt } from '@/lib/types';
import { storage } from '@/lib/storage';
import { formatINR, getCurrentDateISO } from '@/lib/utils';
import ReceiptTemplate from '@/components/documents/ReceiptTemplate';
import DocumentActionBar from '@/components/documents/DocumentActionBar';
import { Receipt as ReceiptIcon, User, Calculator, Eye, Sparkles } from 'lucide-react';

export default function ReceiptGeneratorPage() {
  const { businessProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const [receipt, setReceipt] = useState<Receipt>({
    id: `rec-${Date.now()}`,
    userId: 'user-01',
    receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    date: getCurrentDateISO(),
    customerName: 'Bharat Retail Tech Private Limited',
    amountReceived: 124785,
    paymentMethod: 'Bank Transfer',
    invoiceNumber: 'INV-2026-089',
    paymentReference: 'NEFT/HDFC/TXN99882211',
    notes: 'Full settlement received towards software customization services.',
    receivedBy: businessProfile.ownerName || 'Rajesh Sharma',
    seller: businessProfile,
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    setReceipt((prev) => ({
      ...prev,
      seller: businessProfile,
      receivedBy: prev.receivedBy || businessProfile.ownerName,
    }));
  }, [businessProfile]);

  const handleSave = () => {
    storage.saveReceipt(receipt);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
            <ReceiptIcon className="w-4 h-4" />
            <span>Digital Payment Receipts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Payment Receipt Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Issue official digital payment receipts for Cash, UPI, NEFT, Cheque and Card transactions instantly.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl shrink-0 no-print">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Edit Receipt
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'preview' ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>2. Preview Receipt</span>
          </button>
        </div>
      </div>

      <DocumentActionBar
        documentId={receipt.receiptNumber}
        documentTitle={`Receipt-${receipt.receiptNumber}`}
        targetElementId="receipt-document"
        onSave={handleSave}
        whatsappSummaryText={`Hello ${receipt.customerName}, payment of ${formatINR(receipt.amountReceived)} has been received with thanks against Receipt #${receipt.receiptNumber}. Thank you, ${receipt.seller.businessName}.`}
      />

      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                <ReceiptIcon className="w-4 h-4 text-teal-600" />
                <span>Receipt Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Receipt Number *</label>
                  <input
                    type="text"
                    value={receipt.receiptNumber}
                    onChange={(e) => setReceipt({ ...receipt, receiptNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Receipt Date *</label>
                  <input
                    type="date"
                    value={receipt.date}
                    onChange={(e) => setReceipt({ ...receipt, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Received From (Customer Name) *</label>
                  <input
                    type="text"
                    value={receipt.customerName}
                    onChange={(e) => setReceipt({ ...receipt, customerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount Received (₹) *</label>
                  <input
                    type="number"
                    value={receipt.amountReceived}
                    onChange={(e) => setReceipt({ ...receipt, amountReceived: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method *</label>
                  <select
                    value={receipt.paymentMethod}
                    onChange={(e) => setReceipt({ ...receipt, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold bg-white"
                  >
                    <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT / IMPS / RTGS)</option>
                    <option value="Credit/Debit Card">Credit / Debit Card</option>
                    <option value="Cheque">Cheque / Demand Draft</option>
                    <option value="Other">Other Mode</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Against Invoice No (Optional)</label>
                  <input
                    type="text"
                    placeholder="INV-2026-089"
                    value={receipt.invoiceNumber || ''}
                    onChange={(e) => setReceipt({ ...receipt, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Transaction Ref / UTR No</label>
                  <input
                    type="text"
                    placeholder="e.g. UTR12345678"
                    value={receipt.paymentReference || ''}
                    onChange={(e) => setReceipt({ ...receipt, paymentReference: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Received By</label>
                  <input
                    type="text"
                    value={receipt.receivedBy}
                    onChange={(e) => setReceipt({ ...receipt, receivedBy: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Remarks</label>
                  <textarea
                    rows={2}
                    value={receipt.notes || ''}
                    onChange={(e) => setReceipt({ ...receipt, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 sticky top-24">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                Payment Summary
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Customer:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[150px]">{receipt.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Mode:</span>
                  <span className="font-bold text-teal-700">{receipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200 text-base font-black text-slate-950">
                  <span>Received Total:</span>
                  <span className="text-teal-600">{formatINR(receipt.amountReceived)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-500/25 flex items-center justify-center gap-2 transition"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Receipt PDF</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <ReceiptTemplate receipt={receipt} id="receipt-document" />
        </div>
      )}
    </div>
  );
}
