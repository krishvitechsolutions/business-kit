'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { DeliveryChallan, DeliveryChallanItem, TemplateId, TransportationReason } from '@/lib/types';
import { storage } from '@/lib/storage';
import { INDIAN_STATES, GST_RATES, UNITS } from '@/lib/constants';
import { formatINR, getCurrentDateISO, numberToWordsIndian } from '@/lib/utils';
import DeliveryChallanTemplate from '@/components/documents/DeliveryChallanTemplate';
import DocumentActionBar from '@/components/documents/DocumentActionBar';
import {
  Truck,
  Plus,
  Trash2,
  Building2,
  User,
  Calculator,
  Eye,
  Sparkles,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

export default function DeliveryChallanGeneratorPage() {
  const { businessProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [templateId, setTemplateId] = useState<TemplateId>('modern');

  const [challan, setChallan] = useState<DeliveryChallan>({
    id: `dc-${Date.now()}`,
    userId: 'user-01',
    challanNumber: `DC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    challanDate: getCurrentDateISO(),
    ewayBillNumber: '341098234512',
    vehicleNumber: 'KA-01-MJ-8822',
    transporterName: 'VRL Logistics Express Ltd',
    transportMode: 'Road Transport',
    reasonForTransportation: 'Job Work',
    status: 'issued',
    templateId: 'modern',
    consignor: businessProfile,
    consigneeName: 'Precision CNC Works & Tooling Ltd',
    consigneeGstin: '29AABCP1122E1Z5',
    consigneePhone: '+91 98450 77889',
    consigneeEmail: 'plant.incharge@precisioncnc.in',
    consigneeAddress: 'Plot 45, Peenya Industrial Area, Phase 2',
    consigneeState: 'Karnataka',
    consigneeCity: 'Bengaluru',
    consigneePincode: '560058',
    placeOfSupply: 'Karnataka',
    items: [
      {
        id: '1',
        description: 'Raw Aluminium Alloy Extrusions (Grade 6061-T6) for CNC Machining',
        hsnSac: '760429',
        quantity: 150,
        unit: 'KGS (Kilograms)',
        taxableRate: 420,
        gstRate: 18,
        totalTax: 11340,
        totalValue: 74340,
      },
      {
        id: '2',
        description: 'Stainless Steel Fasteners & Mounting Brackets (SS 304)',
        hsnSac: '731815',
        quantity: 500,
        unit: 'PCS (Pieces)',
        taxableRate: 45,
        gstRate: 18,
        totalTax: 4050,
        totalValue: 26550,
      },
    ],
    subtotal: 85500,
    totalTax: 15390,
    grandTotal: 100890,
    amountInWords: numberToWordsIndian(100890),
    declaration:
      'Goods dispatched strictly for Job Work processing under Rule 55 of CGST Rules, 2017. To be returned after processing within 180 days.',
    terms:
      '1. Transporter copy to accompany the vehicle during transit.\n2. Quantity & physical integrity must be verified upon delivery at site.',
    notes: 'Contact dispatch manager at +91 98765 43210 for gate entry verification.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    setChallan((prev) => ({ ...prev, consignor: businessProfile }));
  }, [businessProfile]);

  useEffect(() => {
    let subtotal = 0;
    let totalTax = 0;

    const items = challan.items.map((item) => {
      const itemSub = Number(item.quantity || 0) * Number(item.taxableRate || 0);
      const itemTax = (itemSub * Number(item.gstRate || 0)) / 100;
      subtotal += itemSub;
      totalTax += itemTax;
      return {
        ...item,
        totalTax: itemTax,
        totalValue: itemSub + itemTax,
      };
    });

    const grand = Math.round(subtotal + totalTax);

    setChallan((prev) => ({
      ...prev,
      items,
      subtotal,
      totalTax,
      grandTotal: grand,
      amountInWords: numberToWordsIndian(grand),
      templateId,
    }));
  }, [challan.items.length, JSON.stringify(challan.items.map((i) => ({ q: i.quantity, r: i.taxableRate, g: i.gstRate }))), templateId]);

  const handleAddItem = () => {
    setChallan((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: String(Date.now()),
          description: '',
          hsnSac: '',
          quantity: 1,
          unit: 'PCS (Pieces)',
          taxableRate: 0,
          gstRate: 18,
          totalTax: 0,
          totalValue: 0,
        },
      ],
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (challan.items.length <= 1) return;
    setChallan((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const handleItemChange = (id: string, field: keyof DeliveryChallanItem, val: any) => {
    setChallan((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === id ? { ...i, [field]: val } : i)),
    }));
  };

  const handleSave = () => {
    storage.saveDeliveryChallan(challan);
  };

  const transportationReasons: TransportationReason[] = [
    'Job Work',
    'Supply on Approval',
    'Exhibition or Trade Fair',
    'Internal Transfer / For Own Use',
    'Line Sale / Consignment',
    'Others',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>Goods Movement & Dispatch Note</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Delivery Challan Generator (GST Rule 55)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Create statutory delivery challans for Job Work, goods sent on approval, trade fairs, and branch transfers without an invoice.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl shrink-0 no-print">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Edit Challan
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'preview' ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>2. Preview & Export</span>
          </button>
        </div>
      </div>

      <DocumentActionBar
        documentId={challan.challanNumber}
        documentTitle={`DeliveryChallan-${challan.challanNumber}`}
        targetElementId="delivery-challan-document"
        onSave={handleSave}
        selectedTemplate={templateId}
        onTemplateChange={(t) => setTemplateId(t)}
        whatsappRecipientPhone={challan.consigneePhone}
        whatsappSummaryText={`Hello ${challan.consigneeName}, please find Delivery Challan #${challan.challanNumber} from ${challan.consignor.businessName} for goods dispatched via ${challan.vehicleNumber || 'transport'}. Total Consignment Value: ${formatINR(challan.grandTotal)}.`}
      />

      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Reason and Transport Meta */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>Transportation Purpose & Logistics Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Challan Number *</label>
                  <input
                    type="text"
                    value={challan.challanNumber}
                    onChange={(e) => setChallan({ ...challan, challanNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Challan Date *</label>
                  <input
                    type="date"
                    value={challan.challanDate}
                    onChange={(e) => setChallan({ ...challan, challanDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Transportation *</label>
                  <select
                    value={challan.reasonForTransportation}
                    onChange={(e) => setChallan({ ...challan, reasonForTransportation: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold bg-white"
                  >
                    {transportationReasons.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle / Truck Number</label>
                  <input
                    type="text"
                    placeholder="KA-01-MJ-8822"
                    value={challan.vehicleNumber || ''}
                    onChange={(e) => setChallan({ ...challan, vehicleNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-Way Bill No (if &gt; ₹50,000)</label>
                  <input
                    type="text"
                    placeholder="341098234512"
                    value={challan.ewayBillNumber || ''}
                    onChange={(e) => setChallan({ ...challan, ewayBillNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Transporter / Logistics Co</label>
                  <input
                    type="text"
                    placeholder="e.g. VRL Logistics"
                    value={challan.transporterName || ''}
                    onChange={(e) => setChallan({ ...challan, transporterName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Consignee (Recipient) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                <span>Consignee (Recipient / Destination Party)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Consignee Name / Firm *</label>
                  <input
                    type="text"
                    value={challan.consigneeName}
                    onChange={(e) => setChallan({ ...challan, consigneeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Consignee GSTIN</label>
                  <input
                    type="text"
                    placeholder="29ABCDE1234F1Z5"
                    value={challan.consigneeGstin || ''}
                    onChange={(e) => setChallan({ ...challan, consigneeGstin: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={challan.consigneePhone || ''}
                    onChange={(e) => setChallan({ ...challan, consigneePhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Place of Supply (State) *</label>
                  <select
                    value={challan.placeOfSupply}
                    onChange={(e) =>
                      setChallan({
                        ...challan,
                        placeOfSupply: e.target.value,
                        consigneeState: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s.code + s.name} value={s.name}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Site Address *</label>
                  <textarea
                    rows={2}
                    value={challan.consigneeAddress}
                    onChange={(e) => setChallan({ ...challan, consigneeAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Goods Items */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-600" />
                  <span>Consignment Items Description</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs"
                >
                  <Plus className="w-4 h-4" /> Add Goods Item
                </button>
              </div>

              <div className="space-y-4">
                {challan.items.map((item, index) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">#{index + 1} Goods Item</span>
                      {challan.items.length > 1 && (
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
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Description of Goods *</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">HSN/SAC Code</label>
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
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Taxable Rate (₹)</label>
                        <input
                          type="number"
                          value={item.taxableRate}
                          onChange={(e) => handleItemChange(item.id, 'taxableRate', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statutory Declaration */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Statutory Rule 55 Declaration *</label>
                <textarea
                  rows={2}
                  value={challan.declaration}
                  onChange={(e) => setChallan({ ...challan, declaration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 sticky top-24">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                Consignment Valuation
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Goods Taxable Value:</span>
                  <span className="font-semibold">{formatINR(challan.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated GST Taxes:</span>
                  <span className="font-semibold">{formatINR(challan.totalTax)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200 text-base font-black text-slate-950">
                  <span>Total Consignment:</span>
                  <span className="text-amber-600">{formatINR(challan.grandTotal)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition"
              >
                <Eye className="w-4 h-4" />
                <span>Preview & Export Challan</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <DeliveryChallanTemplate challan={challan} id="delivery-challan-document" />
        </div>
      )}
    </div>
  );
}
