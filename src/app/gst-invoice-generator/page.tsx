'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Invoice, LineItem, TemplateId } from '@/lib/types';
import { storage } from '@/lib/storage';
import { INDIAN_STATES, GST_RATES, UNITS, COMMON_HSN_SAC, DEFAULT_TERMS } from '@/lib/constants';
import {
  formatINR,
  getCurrentDateISO,
  getFutureDateISO,
  numberToWordsIndian,
  validateGSTIN,
  validatePAN,
} from '@/lib/utils';
import InvoiceTemplate from '@/components/documents/InvoiceTemplate';
import DocumentActionBar from '@/components/documents/DocumentActionBar';
import {
  Plus,
  Trash2,
  Sparkles,
  Building2,
  User,
  Calculator,
  Eye,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import AdBanner from '@/components/layout/AdBanner';

export default function GSTInvoiceGeneratorPage() {
  const { businessProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [templateId, setTemplateId] = useState<TemplateId>('modern');

  // Initial Invoice State
  const [invoice, setInvoice] = useState<Invoice>({
    id: `inv-${Date.now()}`,
    userId: 'user-01',
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    invoiceDate: getCurrentDateISO(),
    dueDate: getFutureDateISO(15),
    status: 'draft',
    templateId: 'modern',
    seller: businessProfile,
    customerName: 'Tata Teleconsulting Services Ltd',
    customerGstin: '27AABCT3456D1Z4',
    customerPan: 'AABCT3456D',
    customerPhone: '+91 98200 12345',
    customerEmail: 'finance@tatatele.com',
    customerAddress: 'Nariman Point, Marine Lines',
    customerState: 'Maharashtra',
    customerCity: 'Mumbai',
    customerPincode: '400021',
    placeOfSupply: 'Maharashtra',
    isInterState: true,
    isReverseCharge: false,
    paymentTerms: 'Due in 15 Days',
    items: [
      {
        id: '1',
        name: 'Enterprise Cloud Architecture Consulting',
        description: 'Multi-region AWS setup and Kubernetes cluster design',
        hsnSac: '998311',
        quantity: 1,
        unit: 'SRV (Services)',
        rate: 75000,
        discount: 0,
        discountType: 'percent',
        gstRate: 18,
        amount: 75000,
      },
      {
        id: '2',
        name: 'Annual Software Maintenance & SLA Support',
        description: '24/7 incident response and patch updates',
        hsnSac: '998313',
        quantity: 1,
        unit: 'MTH (Months)',
        rate: 20000,
        discount: 5,
        discountType: 'percent',
        gstRate: 18,
        amount: 19000,
      },
    ],
    subtotal: 95000,
    totalDiscount: 1000,
    taxableAmount: 94000,
    cgst: 0,
    sgst: 0,
    igst: 16920,
    totalTax: 16920,
    roundOff: 0,
    grandTotal: 110920,
    amountInWords: numberToWordsIndian(110920),
    notes: 'Thank you for your business. For queries, contact billing@apexinfotech.in.',
    terms: DEFAULT_TERMS,
    bankDetails: {
      bankName: businessProfile.bankName || 'HDFC Bank Ltd',
      accountNumber: businessProfile.accountNumber || '50200012345678',
      ifsc: businessProfile.ifsc || 'HDFC0001234',
      holderName: businessProfile.accountHolderName || businessProfile.businessName,
      upiId: businessProfile.upiId || 'apexinfotech@hdfcbank',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Keep seller synced with business profile
  useEffect(() => {
    setInvoice((prev) => ({
      ...prev,
      seller: businessProfile,
      bankDetails: {
        bankName: businessProfile.bankName || 'HDFC Bank Ltd',
        accountNumber: businessProfile.accountNumber || '50200012345678',
        ifsc: businessProfile.ifsc || 'HDFC0001234',
        holderName: businessProfile.accountHolderName || businessProfile.businessName,
        upiId: businessProfile.upiId || 'apexinfotech@hdfcbank',
      },
    }));
  }, [businessProfile]);

  // Recalculate totals on item or state changes
  useEffect(() => {
    const isInter = invoice.seller.state !== invoice.placeOfSupply;

    let subtotal = 0;
    let totalDiscount = 0;
    let taxable = 0;
    let totalTax = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    const recalculatedItems = invoice.items.map((item) => {
      const itemSub = Number(item.quantity || 0) * Number(item.rate || 0);
      let discVal = 0;
      if (item.discountType === 'percent' || !item.discountType) {
        discVal = (itemSub * Number(item.discount || 0)) / 100;
      } else {
        discVal = Number(item.discount || 0);
      }
      const itemTaxable = Math.max(0, itemSub - discVal);
      const taxRate = Number(item.gstRate || 0);
      const itemTax = (itemTaxable * taxRate) / 100;

      subtotal += itemSub;
      totalDiscount += discVal;
      taxable += itemTaxable;
      totalTax += itemTax;

      if (isInter) {
        igst += itemTax;
      } else {
        cgst += itemTax / 2;
        sgst += itemTax / 2;
      }

      return {
        ...item,
        amount: itemTaxable,
      };
    });

    const grand = taxable + totalTax;
    const rounded = Math.round(grand);
    const roundOff = Number((rounded - grand).toFixed(2));

    setInvoice((prev) => ({
      ...prev,
      isInterState: isInter,
      items: recalculatedItems,
      subtotal,
      totalDiscount,
      taxableAmount: taxable,
      cgst,
      sgst,
      igst,
      totalTax,
      roundOff,
      grandTotal: rounded,
      amountInWords: numberToWordsIndian(rounded),
      templateId,
    }));
  }, [
    invoice.items.length,
    JSON.stringify(invoice.items.map((i) => ({ q: i.quantity, r: i.rate, d: i.discount, g: i.gstRate }))),
    invoice.placeOfSupply,
    invoice.seller.state,
    templateId,
  ]);

  const handleAddItem = () => {
    const newItem: LineItem = {
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
    };
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (invoice.items.length <= 1) return;
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const handleItemChange = (id: string, field: keyof LineItem, val: any) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    }));
  };

  const handleSaveInvoice = () => {
    storage.saveInvoice(invoice);
  };

  const handleDuplicate = () => {
    const duplicated: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInvoice(duplicated);
    storage.saveInvoice(duplicated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Official GST Compliant Maker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            GST Invoice Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Create, preview and export GST tax invoices with instant UPI payment QR code, CGST/SGST/IGST breakdown, and HSN lookup.
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl shrink-0 no-print">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'editor'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Edit Details
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>2. Preview & Export</span>
          </button>
        </div>
      </div>

      {/* ACTION BAR (Save, PDF, Print, WhatsApp, Template Switcher) */}
      <DocumentActionBar
        documentId={invoice.invoiceNumber}
        documentTitle={`Invoice-${invoice.invoiceNumber}`}
        targetElementId="invoice-document"
        onSave={handleSaveInvoice}
        onDuplicate={handleDuplicate}
        selectedTemplate={templateId}
        onTemplateChange={(t) => setTemplateId(t)}
        whatsappRecipientPhone={invoice.customerPhone}
        whatsappSummaryText={`Hello ${invoice.customerName}, please find your Tax Invoice #${invoice.invoiceNumber} from ${invoice.seller.businessName}. Total Amount: ${formatINR(invoice.grandTotal)}. Pay via UPI: ${invoice.seller.upiId}. Thank you!`}
      />

      {/* MAIN CONTENT AREA */}
      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Invoice Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. INVOICE META & SELLER SECTION */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Invoice & Seller Information</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Profile Auto-Synced
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Invoice Number *</label>
                  <input
                    type="text"
                    value={invoice.invoiceNumber}
                    onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Invoice Date *</label>
                  <input
                    type="date"
                    value={invoice.invoiceDate}
                    onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Seller details preview */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{invoice.seller.businessName}</p>
                  <p className="text-[11px]">GSTIN: {invoice.seller.gstin || 'Unregistered'} | State: {invoice.seller.state}</p>
                  <p className="text-[11px] text-slate-500 truncate max-w-sm">{invoice.seller.address}</p>
                </div>
                <a
                  href="/dashboard/profile"
                  className="text-[11px] text-blue-600 font-bold hover:underline shrink-0 self-start"
                >
                  Edit Business Profile →
                </a>
              </div>
            </div>

            {/* 2. CUSTOMER / CLIENT SECTION */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Customer / Billed To</span>
                </div>
                <span className="text-[11px] font-bold text-slate-500">
                  {invoice.isInterState ? '⚡ Inter-State (IGST)' : '🔹 Intra-State (CGST + SGST)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer / Company Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Reliance Retail / John Doe"
                    value={invoice.customerName}
                    onChange={(e) => setInvoice({ ...invoice, customerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer GSTIN (15 Digits)</label>
                  <input
                    type="text"
                    placeholder="27ABCDE1234F1Z5"
                    value={invoice.customerGstin || ''}
                    onChange={(e) =>
                      setInvoice({
                        ...invoice,
                        customerGstin: e.target.value.toUpperCase(),
                        customerPan: e.target.value.slice(2, 12).toUpperCase(),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={invoice.customerPhone || ''}
                    onChange={(e) => setInvoice({ ...invoice, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer Email</label>
                  <input
                    type="email"
                    placeholder="billing@customer.com"
                    value={invoice.customerEmail || ''}
                    onChange={(e) => setInvoice({ ...invoice, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Billing Address</label>
                  <textarea
                    rows={2}
                    placeholder="Building, Street, Area, City"
                    value={invoice.customerAddress || ''}
                    onChange={(e) => setInvoice({ ...invoice, customerAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Place of Supply (State) *</label>
                  <select
                    value={invoice.placeOfSupply}
                    onChange={(e) =>
                      setInvoice({
                        ...invoice,
                        placeOfSupply: e.target.value,
                        customerState: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {INDIAN_STATES.map((state) => (
                      <option key={state.code + state.name} value={state.name}>
                        {state.code} - {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pincode (6 Digits)</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="560034"
                    value={invoice.customerPincode || ''}
                    onChange={(e) => setInvoice({ ...invoice, customerPincode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. PRODUCT & SERVICE ITEMS TABLE */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>Items & Taxable Services</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="space-y-4">
                {invoice.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-500">#{index + 1} Item</span>
                      {invoice.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Product / Service Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Website Development"
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-semibold"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">HSN/SAC Code</label>
                        <input
                          type="text"
                          placeholder="998311"
                          value={item.hsnSac || ''}
                          onChange={(e) => handleItemChange(item.id, 'hsnSac', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">GST Slab *</label>
                        <select
                          value={item.gstRate}
                          onChange={(e) => handleItemChange(item.id, 'gstRate', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-bold"
                        >
                          {GST_RATES.map((rate) => (
                            <option key={rate} value={rate}>
                              {rate}% GST
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          min={0.01}
                          step="any"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Unit</label>
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
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
                          min={0}
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, 'rate', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-bold"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Discount %</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={item.discount}
                          onChange={(e) => handleItemChange(item.id, 'discount', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        />
                      </div>

                      <div className="sm:col-span-12">
                        <input
                          type="text"
                          placeholder="Optional item notes or technical specifications"
                          value={item.description || ''}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. TERMS, NOTES & BANK DETAILS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Terms, Notes & Bank Account</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Terms & Conditions</label>
                  <textarea
                    rows={4}
                    value={invoice.terms}
                    onChange={(e) => setInvoice({ ...invoice, terms: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer Notes / Remarks</label>
                  <textarea
                    rows={4}
                    value={invoice.notes}
                    onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Calculation Summary & Action Widget */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 sticky top-24">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                Live Tax Summary
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">{formatINR(invoice.subtotal)}</span>
                </div>
                {invoice.totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span className="font-semibold">-{formatINR(invoice.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-700 pt-1 border-t border-slate-100">
                  <span className="font-bold">Taxable Amount:</span>
                  <span className="font-bold text-slate-900">{formatINR(invoice.taxableAmount)}</span>
                </div>

                {invoice.isInterState ? (
                  <div className="flex justify-between text-slate-600">
                    <span>IGST (Inter-State):</span>
                    <span className="font-semibold text-blue-700">{formatINR(invoice.igst)}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <span>CGST (Central):</span>
                      <span className="font-semibold">{formatINR(invoice.cgst)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>SGST (State):</span>
                      <span className="font-semibold">{formatINR(invoice.sgst)}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200 text-base font-black text-slate-950">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">{formatINR(invoice.grandTotal)}</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[11px] text-slate-800">
                  <span className="font-bold text-amber-900 uppercase text-[10px]">In Words:</span>
                  <p className="mt-0.5 font-semibold leading-tight">{invoice.amountInWords}</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview & Download PDF</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sidebar Ad Placement */}
            <AdBanner slot="sidebar" />
          </div>
        </div>
      ) : (
        /* PREVIEW TAB */
        <div className="space-y-6">
          <div className="flex justify-center">
            <InvoiceTemplate invoice={invoice} id="invoice-document" />
          </div>
        </div>
      )}

      {/* SEO & Knowledge FAQs Section for /gst-invoice-generator */}
      <section className="mt-16 pt-12 border-t border-slate-200 no-print space-y-6">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            How to generate a GST Tax Invoice online for Indian Businesses?
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Under Section 31 of the CGST Act, every registered supplier of taxable goods and services must issue a tax invoice containing the GSTIN of supplier and buyer, HSN/SAC code, serial invoice number, date of issue, place of supply, and individual CGST, SGST, or IGST tax amounts. BizTools India automates all calculations and embeds an NPCI UPI payment QR code directly onto your invoice.
          </p>
        </div>
      </section>
    </div>
  );
}
