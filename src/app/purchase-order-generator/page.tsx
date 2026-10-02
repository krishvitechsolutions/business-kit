'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PurchaseOrder, TemplateId } from '@/lib/types';
import { storage } from '@/lib/storage';
import { GST_RATES, UNITS } from '@/lib/constants';
import { formatINR, getCurrentDateISO, getFutureDateISO } from '@/lib/utils';
import PurchaseOrderTemplate from '@/components/documents/PurchaseOrderTemplate';
import DocumentActionBar from '@/components/documents/DocumentActionBar';
import { Plus, Trash2, Building2, User, Calculator, Eye, Sparkles } from 'lucide-react';

export default function PurchaseOrderGeneratorPage() {
  const { businessProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [templateId, setTemplateId] = useState<TemplateId>('modern');

  const [po, setPo] = useState<PurchaseOrder>({
    id: `po-${Date.now()}`,
    userId: 'user-01',
    poNumber: `PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    date: getCurrentDateISO(),
    deliveryDate: getFutureDateISO(15),
    paymentTerms: '30 Days Net from Delivery',
    status: 'issued',
    templateId: 'modern',
    buyer: businessProfile,
    supplierName: 'Dell India Enterprise Hardware Ltd',
    supplierGstin: '29AABCB1234D1Z2',
    supplierPhone: '+91 80 4000 5000',
    supplierEmail: 'b2b.orders@dellindia.com',
    supplierAddress: 'Divyasree Greens, Inner Ring Road, Domlur, Bengaluru, Karnataka 560071',
    shippingAddress: `${businessProfile.address}, ${businessProfile.city}, ${businessProfile.state} - ${businessProfile.pincode}`,
    items: [
      {
        id: '1',
        product: 'Dell Latitude 5440 Core i7 Laptops (16GB RAM / 512GB SSD)',
        sku: 'DELL-LAT-5440-i7',
        quantity: 4,
        unit: 'NOS (Numbers)',
        unitPrice: 72000,
        gstRate: 18,
        total: 339840,
      },
    ],
    subtotal: 288000,
    tax: 51840,
    grandTotal: 339840,
    notes: 'Please include standard 3-year onsite manufacturer warranty certificates with serial numbers.',
    terms: 'Goods must be packed securely. Inspection will take place within 48 hours of delivery.',
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    setPo((prev) => ({
      ...prev,
      buyer: businessProfile,
      shippingAddress: `${businessProfile.address}, ${businessProfile.city}, ${businessProfile.state} - ${businessProfile.pincode}`,
    }));
  }, [businessProfile]);

  useEffect(() => {
    let subtotal = 0;
    let tax = 0;

    const items = po.items.map((item) => {
      const itemSub = Number(item.quantity || 0) * Number(item.unitPrice || 0);
      const itemTax = (itemSub * Number(item.gstRate || 0)) / 100;
      subtotal += itemSub;
      tax += itemTax;
      return {
        ...item,
        total: itemSub + itemTax,
      };
    });

    setPo((prev) => ({
      ...prev,
      items,
      subtotal,
      tax,
      grandTotal: Math.round(subtotal + tax),
    }));
  }, [po.items.length, JSON.stringify(po.items.map((i) => ({ q: i.quantity, u: i.unitPrice, g: i.gstRate })))]);

  const handleAddItem = () => {
    setPo((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: String(Date.now()),
          product: '',
          sku: '',
          quantity: 1,
          unit: 'NOS (Numbers)',
          unitPrice: 0,
          gstRate: 18,
          total: 0,
        },
      ],
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (po.items.length <= 1) return;
    setPo((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const handleItemChange = (id: string, field: string, val: any) => {
    setPo((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === id ? { ...i, [field]: val } : i)),
    }));
  };

  const handleSave = () => {
    storage.savePurchaseOrder(po);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Procurement & Vendor Orders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Purchase Order (PO) Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Create and send formal commercial Purchase Orders to suppliers with SKU breakdown and delivery terms.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl shrink-0 no-print">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Edit Order
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'preview' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>2. Preview PO</span>
          </button>
        </div>
      </div>

      <DocumentActionBar
        documentId={po.poNumber}
        documentTitle={`PurchaseOrder-${po.poNumber}`}
        targetElementId="po-document"
        onSave={handleSave}
        whatsappRecipientPhone={po.supplierPhone}
        whatsappSummaryText={`Hello ${po.supplierName}, please find Purchase Order #${po.poNumber} from ${po.buyer.businessName} for total value of ${formatINR(po.grandTotal)}.`}
      />

      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* PO Meta */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Purchase Order Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PO Number *</label>
                  <input
                    type="text"
                    value={po.poNumber}
                    onChange={(e) => setPo({ ...po, poNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Order Date *</label>
                  <input
                    type="date"
                    value={po.date}
                    onChange={(e) => setPo({ ...po, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    value={po.deliveryDate}
                    onChange={(e) => setPo({ ...po, deliveryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={po.paymentTerms}
                    onChange={(e) => setPo({ ...po, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Vendor Details */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Supplier / Vendor Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Supplier Company Name *</label>
                  <input
                    type="text"
                    value={po.supplierName}
                    onChange={(e) => setPo({ ...po, supplierName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Supplier GSTIN</label>
                  <input
                    type="text"
                    value={po.supplierGstin || ''}
                    onChange={(e) => setPo({ ...po, supplierGstin: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Supplier Phone</label>
                  <input
                    type="tel"
                    value={po.supplierPhone || ''}
                    onChange={(e) => setPo({ ...po, supplierPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Supplier Email</label>
                  <input
                    type="email"
                    value={po.supplierEmail || ''}
                    onChange={(e) => setPo({ ...po, supplierEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Supplier Address</label>
                  <textarea
                    rows={2}
                    value={po.supplierAddress}
                    onChange={(e) => setPo({ ...po, supplierAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span>Ordered Items</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>

              <div className="space-y-4">
                {po.items.map((item, index) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">#{index + 1} Item</span>
                      {po.items.length > 1 && (
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
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Product Description *</label>
                        <input
                          type="text"
                          value={item.product}
                          onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">SKU / Model</label>
                        <input
                          type="text"
                          value={item.sku || ''}
                          onChange={(e) => handleItemChange(item.id, 'sku', e.target.value)}
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
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>
                      <div className="sm:col-span-4">
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
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Unit Price (₹)</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 sticky top-24">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                PO Total Value
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatINR(po.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST Tax:</span>
                  <span className="font-semibold">{formatINR(po.tax)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200 text-base font-black text-slate-950">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">{formatINR(po.grandTotal)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition"
              >
                <Eye className="w-4 h-4" />
                <span>Preview PO Document</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <PurchaseOrderTemplate po={po} id="po-document" />
        </div>
      )}
    </div>
  );
}
