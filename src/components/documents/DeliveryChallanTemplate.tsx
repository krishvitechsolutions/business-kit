'use client';

import React from 'react';
import { DeliveryChallan } from '@/lib/types';
import { formatINR, formatDate, numberToWordsIndian } from '@/lib/utils';
import { Truck, ShieldCheck, FileText, CheckCircle2, MapPin } from 'lucide-react';

interface DeliveryChallanTemplateProps {
  challan: DeliveryChallan;
  id?: string;
}

export default function DeliveryChallanTemplate({
  challan,
  id = 'delivery-challan-document',
}: DeliveryChallanTemplateProps) {
  const template = challan.templateId || 'modern';

  const themeClasses = {
    modern: {
      header: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 rounded-t-2xl border-b-4 border-amber-500',
      th: 'bg-blue-50 text-blue-950 font-bold border-b border-blue-200',
      totalCard: 'bg-blue-50/80 border border-blue-200',
      border: 'border-slate-200',
    },
    indigo: {
      header: 'bg-indigo-950 text-white p-6 rounded-t-2xl border-b-4 border-indigo-500',
      th: 'bg-indigo-50 text-indigo-950 font-bold border-b border-indigo-200',
      totalCard: 'bg-indigo-50/80 border border-indigo-200',
      border: 'border-slate-200',
    },
    classic: {
      header: 'bg-white text-slate-900 p-6 border-b-2 border-slate-900',
      th: 'bg-slate-100 text-slate-900 font-bold border-b-2 border-slate-300',
      totalCard: 'bg-slate-50 border-2 border-slate-300',
      border: 'border-slate-300',
    },
    minimal: {
      header: 'bg-white text-slate-900 p-6 border-b border-slate-200',
      th: 'bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]',
      totalCard: 'bg-slate-50 border border-slate-200',
      border: 'border-slate-200',
    },
    bordered: {
      header: 'bg-amber-950 text-white p-6 border-b-4 border-amber-500',
      th: 'bg-amber-50 text-amber-950 font-bold border-b-2 border-amber-200',
      totalCard: 'bg-amber-50 border-2 border-amber-300',
      border: 'border-slate-300',
    },
  }[template] || {
    header: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 rounded-t-2xl border-b-4 border-amber-500',
    th: 'bg-blue-50 text-blue-950 font-bold border-b border-blue-200',
    totalCard: 'bg-blue-50/80 border border-blue-200',
    border: 'border-slate-200',
  };

  return (
    <div
      id={id}
      className={`print-area w-full max-w-[850px] mx-auto bg-white rounded-2xl shadow-xl border ${themeClasses.border} overflow-hidden text-slate-800 text-xs font-sans transition-all`}
      style={{ minHeight: '1050px' }}
    >
      {/* Header */}
      <div className={themeClasses.header}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded">
                GST DRC Rule 55 Compliant
              </span>
              <span className="text-[11px] font-bold tracking-widest uppercase opacity-80">
                Delivery Challan
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{challan.consignor.businessName}</h1>
            <p className="text-xs opacity-90">
              GSTIN: <span className="font-mono font-bold">{challan.consignor.gstin || 'Unregistered'}</span> | PAN: {challan.consignor.pan || 'N/A'}
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1 bg-white/10 p-3.5 rounded-xl backdrop-blur-xs">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">Challan No</div>
            <div className="text-xl font-black">{challan.challanNumber}</div>
            <div className="text-xs opacity-90">
              Date: <span className="font-bold">{formatDate(challan.challanDate)}</span>
            </div>
            {challan.ewayBillNumber && (
              <div className="text-[11px] text-emerald-300 font-mono">
                E-Way Bill: <strong className="font-bold">{challan.ewayBillNumber}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transit & Reason Bar */}
      <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Reason for Transportation:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[11px]">
            {challan.reasonForTransportation}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-700">
          {challan.vehicleNumber && (
            <span className="flex items-center gap-1 font-mono font-bold">
              <Truck className="w-3.5 h-3.5 text-blue-600" /> Vehicle: {challan.vehicleNumber}
            </span>
          )}
          {challan.transporterName && (
            <span>
              Transporter: <strong>{challan.transporterName}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Consignor and Consignee Parties Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100 bg-slate-50/50">
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Consignor (Sender / Dispatch From):</p>
          <p className="font-extrabold text-sm text-slate-900">{challan.consignor.businessName}</p>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">{challan.consignor.address}</p>
          <p className="text-slate-600">
            {challan.consignor.city}, {challan.consignor.state} - {challan.consignor.pincode}
          </p>
          <div className="pt-1 text-slate-600 space-y-0.5">
            {challan.consignor.phone && <p>Phone: {challan.consignor.phone}</p>}
            {challan.consignor.email && <p>Email: {challan.consignor.email}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Consignee (Recipient / Ship To):</p>
          <p className="font-extrabold text-sm text-slate-900">{challan.consigneeName}</p>
          {challan.consigneeGstin && <p className="font-bold text-slate-800">GSTIN: {challan.consigneeGstin}</p>}
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">{challan.consigneeAddress}</p>
          <p className="text-slate-600">
            {challan.consigneeCity ? `${challan.consigneeCity}, ` : ''}
            {challan.consigneeState} {challan.consigneePincode ? `- ${challan.consigneePincode}` : ''}
          </p>
          <div className="pt-1 flex flex-wrap gap-x-4 text-slate-600">
            {challan.consigneePhone && <p>Phone: {challan.consigneePhone}</p>}
            {challan.placeOfSupply && (
              <p className="font-semibold text-blue-700">
                Place of Supply: {challan.placeOfSupply}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Goods Table */}
      <div className="p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={themeClasses.th}>
              <th className="py-2.5 px-3 font-bold text-[11px] rounded-l-lg">#</th>
              <th className="py-2.5 px-3 font-bold text-[11px]">Description of Goods</th>
              <th className="py-2.5 px-3 font-bold text-[11px] text-center">HSN/SAC</th>
              <th className="py-2.5 px-3 font-bold text-[11px] text-center">Qty & Unit</th>
              <th className="py-2.5 px-3 font-bold text-[11px] text-right">Taxable Rate (₹)</th>
              <th className="py-2.5 px-3 font-bold text-[11px] text-center">GST %</th>
              <th className="py-2.5 px-3 font-bold text-[11px] text-right rounded-r-lg">Total Value (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {challan.items.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-slate-50/50">
                <td className="py-3 px-3 text-slate-400 font-medium">{index + 1}</td>
                <td className="py-3 px-3">
                  <p className="font-bold text-slate-900">{item.description}</p>
                </td>
                <td className="py-3 px-3 text-center text-slate-600 font-mono text-[11px]">{item.hsnSac || '-'}</td>
                <td className="py-3 px-3 text-center font-medium">
                  {item.quantity} <span className="text-[10px] text-slate-500">{item.unit.split(' ')[0]}</span>
                </td>
                <td className="py-3 px-3 text-right font-medium">{formatINR(item.taxableRate, false)}</td>
                <td className="py-3 px-3 text-center">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-[10px]">{item.gstRate}%</span>
                </td>
                <td className="py-3 px-3 text-right font-bold text-slate-900">{formatINR(item.totalValue, true)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculations & Statutory Declaration */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            {challan.declaration && (
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Statutory Goods Declaration:</p>
                <p className="text-slate-800 mt-1 leading-relaxed text-xs">{challan.declaration}</p>
              </div>
            )}
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Consignment Value in Words:</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{challan.amountInWords}</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl space-y-2 ${themeClasses.totalCard}`}>
            <div className="flex justify-between text-xs text-slate-700">
              <span>Taxable Goods Value:</span>
              <span className="font-semibold">{formatINR(challan.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-700">
              <span>Applicable GST Tax:</span>
              <span className="font-semibold">{formatINR(challan.totalTax)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t-2 border-slate-300 text-base font-black text-slate-950">
              <span>Total Consignment Value:</span>
              <span className="text-blue-700">{formatINR(challan.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Terms and Dual Signatures */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
          <div className="text-center sm:text-left space-y-6">
            <p className="text-xs font-bold text-slate-900">Receiver&apos;s Signature & Stamp</p>
            <div className="pt-6">
              <div className="inline-block border-t border-slate-400 pt-1 px-8 text-[11px] text-slate-500">
                Received in Good Condition
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-6">
            <p className="text-xs font-bold text-slate-900">For {challan.consignor.businessName}</p>
            <div className="pt-6">
              <div className="inline-block border-t border-slate-400 pt-1 px-8 text-[11px] text-slate-500">
                Authorized Dispatch Signatory
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-[10px] text-slate-500 flex items-center justify-between px-6">
        <span>Delivery Challan issued under Section 31(1)(b) & Rule 55 of CGST Rules 2017.</span>
        <span className="font-semibold text-blue-700">Generated via BizTools India (biztools.in)</span>
      </div>
    </div>
  );
}
