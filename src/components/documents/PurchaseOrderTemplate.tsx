'use client';

import React from 'react';
import { PurchaseOrder } from '@/lib/types';
import { formatINR, formatDate, numberToWordsIndian } from '@/lib/utils';
import { Truck, ShieldCheck, FileCheck } from 'lucide-react';

interface POTemplateProps {
  po: PurchaseOrder;
  id?: string;
}

export default function PurchaseOrderTemplate({ po, id = 'po-document' }: POTemplateProps) {
  return (
    <div
      id={id}
      className="print-area w-full max-w-[850px] mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-slate-800 text-xs font-sans transition-all"
      style={{ minHeight: '1000px' }}
    >
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-t-2xl border-b-4 border-blue-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-blue-400">
              Commercial Purchase Order
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{po.buyer.businessName}</h1>
            <p className="text-xs text-slate-300 mt-1">
              GSTIN: {po.buyer.gstin || 'N/A'} | PAN: {po.buyer.pan || 'N/A'}
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1 bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">P.O. Number</div>
            <div className="text-xl font-black text-white">{po.poNumber}</div>
            <div className="text-xs text-slate-300">
              Date: <span className="font-bold text-white">{formatDate(po.date)}</span>
            </div>
            {po.deliveryDate && (
              <div className="text-xs text-emerald-400 font-bold">
                Expected Delivery: {formatDate(po.deliveryDate)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parties Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100 bg-slate-50/50">
        {/* Vendor */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Vendor / Supplier:</p>
          <p className="font-extrabold text-sm text-slate-900">{po.supplierName}</p>
          {po.supplierGstin && <p className="font-bold text-slate-800">GSTIN: {po.supplierGstin}</p>}
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">{po.supplierAddress}</p>
          <div className="pt-1 text-slate-600 space-y-0.5">
            {po.supplierPhone && <p>Phone: {po.supplierPhone}</p>}
            {po.supplierEmail && <p>Email: {po.supplierEmail}</p>}
          </div>
        </div>

        {/* Shipping / Delivery Destination */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ship To / Billing Address:</p>
          <p className="font-extrabold text-sm text-slate-900">{po.buyer.businessName}</p>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {po.shippingAddress || po.buyer.address}
          </p>
          <p className="text-slate-600">
            {po.buyer.city}, {po.buyer.state} - {po.buyer.pincode}
          </p>
          {po.paymentTerms && (
            <p className="pt-1 font-semibold text-blue-700">
              Payment Terms: <span className="text-slate-900">{po.paymentTerms}</span>
            </p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
              <th className="py-2.5 px-3 font-bold text-[11px] rounded-l-lg">#</th>
              <th className="py-2.5 px-3 font-bold text-[11px]">Item Description & SKU</th>
              <th className="py-2.5 px-3 font-bold text-[11px] text-center">Qty & Unit</th>
              <th className="py-2.5 px-3 font-bold text-[11px] text-right">Unit Price (₹)</th>
              <th className="py-2.5 px-3 font-bold text-[11px] text-center">GST %</th>
              <th className="py-2.5 px-3 font-bold text-[11px] text-right rounded-r-lg">Total Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {po.items.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-slate-50/50">
                <td className="py-3 px-3 text-slate-400 font-medium">{index + 1}</td>
                <td className="py-3 px-3">
                  <p className="font-bold text-slate-900">{item.product}</p>
                  {item.sku && <p className="text-[11px] text-slate-500 font-mono">SKU: {item.sku}</p>}
                </td>
                <td className="py-3 px-3 text-center font-medium">
                  {item.quantity} {item.unit?.split(' ')[0]}
                </td>
                <td className="py-3 px-3 text-right font-medium">{formatINR(item.unitPrice, false)}</td>
                <td className="py-3 px-3 text-center">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-[10px]">{item.gstRate}%</span>
                </td>
                <td className="py-3 px-3 text-right font-bold text-slate-900">{formatINR(item.total, true)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculations */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            {po.notes && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Special Instructions:</p>
                <p className="text-slate-700 mt-1 whitespace-pre-line leading-relaxed">{po.notes}</p>
              </div>
            )}
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Total in Words:</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{numberToWordsIndian(po.grandTotal)}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs text-slate-700">
              <span>Item Subtotal:</span>
              <span className="font-semibold">{formatINR(po.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-700">
              <span>Applicable GST Tax:</span>
              <span className="font-semibold">{formatINR(po.tax)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t-2 border-slate-300 text-base font-black text-slate-950">
              <span>PO Total Value:</span>
              <span className="text-blue-700">{formatINR(po.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Terms and Signatures */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
          <div className="text-[11px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-900 text-xs">Terms & Conditions:</p>
            <p className="whitespace-pre-line leading-relaxed">{po.terms || 'Goods subject to inspection upon delivery.'}</p>
          </div>

          <div className="text-center sm:text-right space-y-6">
            <p className="text-xs font-bold text-slate-900">For {po.buyer.businessName}</p>
            <div className="pt-6">
              <div className="inline-block border-t border-slate-400 pt-1 px-8 text-[11px] text-slate-500">
                Authorized Purchasing Signatory
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
