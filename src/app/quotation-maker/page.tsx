'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Quotation, LineItem, TemplateId, Invoice } from '@/lib/types';
import { storage } from '@/lib/storage';
import { GST_RATES, UNITS, DEFAULT_TERMS } from '@/lib/constants';
import {
  formatINR,
  getCurrentDateISO,
  getFutureDateISO,
  numberToWordsIndian,
} from '@/lib/utils';
import QuotationTemplate from '@/components/documents/QuotationTemplate';
import DocumentActionBar from '@/components/documents/DocumentActionBar';
import {
  Plus,
  Trash2,
  Sparkles,
  Building2,
  User,
  Calculator,
  Eye,
  ArrowRight,
  FileCheck,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdBanner from '@/components/layout/AdBanner';

export default function QuotationMakerPage() {
  const { businessProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [templateId, setTemplateId] = useState<TemplateId>('modern');

  const [quotation, setQuotation] = useState<Quotation>({
    id: `quote-${Date.now()}`,
    userId: 'user-01',
    quotationNumber: `QTN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    date: getCurrentDateISO(),
    validUntil: getFutureDateISO(30),
    status: 'draft',
    templateId: 'modern',
    seller: businessProfile,
    customerName: 'Infosys BPM Solutions Ltd',
    customerGstin: '29AABCI1234D1Z8',
    customerPhone: '+91 99800 55443',
    customerEmail: 'vendor.quotes@infosys.com',
    customerAddress: 'Electronic City Phase 1, Bengaluru, Karnataka 560100',
    items: [
      {
        id: '1',
        name: 'Custom Mobile Application Development (iOS & Android)',
        description: 'Flutter hybrid app with real-time push notifications, payment gateway and admin dashboard',
        hsnSac: '998311',
        quantity: 1,
        unit: 'JOB (Job Work)',
        rate: 150000,
        discount: 10,
        discountType: 'percent',
        gstRate: 18,
        amount: 135000,
      },
      {
        id: '2',
        name: 'UI/UX Design System & Interactive Prototypes',
        description: 'Figma high-fidelity components, micro-animations and developer design tokens',
        hsnSac: '998313',
        quantity: 1,
        unit: 'SET (Sets)',
        rate: 35000,
        discount: 0,
        discountType: 'percent',
        gstRate: 18,
        amount: 35000,
      },
    ],
    subtotal: 185000,
    discount: 15000,
    taxableAmount: 170000,
    cgst: 15300,
    sgst: 15300,
    igst: 0,
    grandTotal: 200600,
    notes: 'Quotation valid for 30 calendar days. 40% advance required upon project kickoff.',
    terms: `1. Timeline: 4-6 weeks upon milestone approval.\n2. Three rounds of feedback included per milestone.\n3. Third-party API charges and server hosting are billed on actuals.`,
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    setQuotation((prev) => ({ ...prev, seller: businessProfile }));
  }, [businessProfile]);

  useEffect(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let taxable = 0;
    let totalTax = 0;

    const items = quotation.items.map((item) => {
      const itemSub = Number(item.quantity || 0) * Number(item.rate || 0);
      const discVal = item.discount ? (itemSub * Number(item.discount)) / 100 : 0;
      const itemTaxable = Math.max(0, itemSub - discVal);
      const itemTax = (itemTaxable * Number(item.gstRate || 0)) / 100;

      subtotal += itemSub;
      totalDiscount += discVal;
      taxable += itemTaxable;
      totalTax += itemTax;

      return { ...item, amount: itemTaxable };
    });

    const isInter = quotation.seller.state !== 'Karnataka';
    const cgst = isInter ? 0 : totalTax / 2;
    const sgst = isInter ? 0 : totalTax / 2;
    const igst = isInter ? totalTax : 0;
    const grand = Math.round(taxable + totalTax);

    setQuotation((prev) => ({
      ...prev,
      items,
      subtotal,
      discount: totalDiscount,
      taxableAmount: taxable,
      cgst,
      sgst,
      igst,
      grandTotal: grand,
      templateId,
    }));
  }, [
    quotation.items.length,
    JSON.stringify(quotation.items.map((i) => ({ q: i.quantity, r: i.rate, d: i.discount, g: i.gstRate }))),
    templateId,
  ]);

  const handleAddItem = () => {
    setQuotation((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: String(Date.now()),
          name: '',
          description: '',
          hsnSac: '',
          quantity: 1,
          unit: 'PCS (Pieces)',
          rate: 0,
          discount: 0,
          discountType: 'percent',
          gstRate: 18,
          amount: 0,
        },
      ],
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (quotation.items.length <= 1) return;
    setQuotation((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const handleItemChange = (id: string, field: keyof LineItem, val: any) => {
    setQuotation((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    }));
  };

  const handleSave = () => {
    storage.saveQuotation(quotation);
  };

  const handleConvertToInvoice = () => {
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      userId: 'user-01',
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      invoiceDate: getCurrentDateISO(),
      dueDate: getFutureDateISO(15),
      status: 'sent',
      templateId: quotation.templateId,
      seller: quotation.seller,
      customerName: quotation.customerName,
      customerGstin: quotation.customerGstin,
      customerPhone: quotation.customerPhone,
      customerEmail: quotation.customerEmail,
      customerAddress: quotation.customerAddress,
      customerState: quotation.seller.state,
      placeOfSupply: quotation.seller.state,
      isInterState: false,
      isReverseCharge: false,
      paymentTerms: 'Due in 15 Days',
      items: quotation.items,
      subtotal: quotation.subtotal,
      totalDiscount: quotation.discount,
      taxableAmount: quotation.taxableAmount,
      cgst: quotation.cgst,
      sgst: quotation.sgst,
      igst: quotation.igst,
      totalTax: quotation.cgst + quotation.sgst + quotation.igst,
      roundOff: 0,
      grandTotal: quotation.grandTotal,
      amountInWords: numberToWordsIndian(quotation.grandTotal),
      notes: `Converted from Quotation #${quotation.quotationNumber}.`,
      terms: quotation.terms,
      bankDetails: {
        bankName: quotation.seller.bankName || '',
        accountNumber: quotation.seller.accountNumber || '',
        ifsc: quotation.seller.ifsc || '',
        holderName: quotation.seller.accountHolderName || '',
        upiId: quotation.seller.upiId || '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.saveInvoice(newInvoice);
    router.push('/gst-invoice-generator');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Business Proposals & Estimates</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Quotation / Estimate Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Create professional price quotations for your clients with automatic tax calculations and 1-click invoice conversion.
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl shrink-0 no-print">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Edit Quotation
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>2. Preview & Export</span>
          </button>
        </div>
      </div>

      {/* Convert to Invoice Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-950">Did the client accept this quote?</h4>
            <p className="text-xs text-indigo-700">Instantly convert this quotation into a formal GST tax invoice with 1 click.</p>
          </div>
        </div>
        <button
          onClick={handleConvertToInvoice}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition shrink-0"
        >
          Convert to GST Invoice →
        </button>
      </div>

      {/* Action Toolbar */}
      <DocumentActionBar
        documentId={quotation.quotationNumber}
        documentTitle={`Quotation-${quotation.quotationNumber}`}
        targetElementId="quotation-document"
        onSave={handleSave}
        selectedTemplate={templateId}
        onTemplateChange={(t) => setTemplateId(t)}
        whatsappRecipientPhone={quotation.customerPhone}
        whatsappSummaryText={`Hello ${quotation.customerName}, please find the price quotation #${quotation.quotationNumber} from ${quotation.seller.businessName}. Total Estimate: ${formatINR(quotation.grandTotal)}. Valid until: ${quotation.validUntil}.`}
      />

      {/* Main Form or Preview */}
      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Meta details */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Quotation Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quotation Number *</label>
                  <input
                    type="text"
                    value={quotation.quotationNumber}
                    onChange={(e) => setQuotation({ ...quotation, quotationNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Issue Date *</label>
                  <input
                    type="date"
                    value={quotation.date}
                    onChange={(e) => setQuotation({ ...quotation, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Valid Until Date</label>
                  <input
                    type="date"
                    value={quotation.validUntil}
                    onChange={(e) => setQuotation({ ...quotation, validUntil: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Client / Recipient Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client / Company Name *</label>
                  <input
                    type="text"
                    value={quotation.customerName}
                    onChange={(e) => setQuotation({ ...quotation, customerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={quotation.customerGstin || ''}
                    onChange={(e) => setQuotation({ ...quotation, customerGstin: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={quotation.customerPhone || ''}
                    onChange={(e) => setQuotation({ ...quotation, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={quotation.customerEmail || ''}
                    onChange={(e) => setQuotation({ ...quotation, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client Address</label>
                  <textarea
                    rows={2}
                    value={quotation.customerAddress || ''}
                    onChange={(e) => setQuotation({ ...quotation, customerAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Scope / Items Table */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  <span>Proposed Items / Services</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>

              <div className="space-y-4">
                {quotation.items.map((item, index) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">#{index + 1} Scope Item</span>
                      {quotation.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Item Title *</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">HSN/SAC</label>
                        <input
                          type="text"
                          value={item.hsnSac || ''}
                          onChange={(e) => handleItemChange(item.id, 'hsnSac', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-mono"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">GST %</label>
                        <select
                          value={item.gstRate}
                          onChange={(e) => handleItemChange(item.id, 'gstRate', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                        >
                          {GST_RATES.map((r) => (
                            <option key={r} value={r}>
                              {r}% GST
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Unit</label>
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        >
                          {UNITS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Unit Rate (₹)</label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, 'rate', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Discount %</label>
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleItemChange(item.id, 'discount', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>
                      <div className="sm:col-span-12">
                        <input
                          type="text"
                          placeholder="Scope description / inclusions"
                          value={item.description || ''}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quotation Notes</label>
                  <textarea
                    rows={3}
                    value={quotation.notes}
                    onChange={(e) => setQuotation({ ...quotation, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Terms & Validity</label>
                  <textarea
                    rows={3}
                    value={quotation.terms}
                    onChange={(e) => setQuotation({ ...quotation, terms: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 sticky top-24">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                Estimate Total
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatINR(quotation.subtotal)}</span>
                </div>
                {quotation.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-{formatINR(quotation.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-700 pt-1 border-t border-slate-100">
                  <span className="font-bold">Taxable Total:</span>
                  <span className="font-bold">{formatINR(quotation.taxableAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST Taxes:</span>
                  <span className="font-semibold">{formatINR(quotation.cgst + quotation.sgst + quotation.igst)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200 text-base font-black text-slate-950">
                  <span>Grand Total:</span>
                  <span className="text-indigo-600">{formatINR(quotation.grandTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Quotation PDF</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <QuotationTemplate quotation={quotation} id="quotation-document" />
        </div>
      )}
    </div>
  );
}
