'use client';

import React from 'react';
import { Quotation } from '@/lib/types';
import { formatINR, formatDate, numberToWordsIndian } from '@/lib/utils';
import { Building2, Phone, Mail, Calendar, Clock, CheckCircle } from 'lucide-react';

interface QuotationTemplateProps {
  quotation: Quotation;
  id?: string;
}

export default function QuotationTemplate({ quotation, id = 'quotation-document' }: QuotationTemplateProps) {
  const template = quotation.templateId || 'modern';

  const themeClasses = {
    modern: {
      header: 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 rounded-t-2xl',
      th: 'bg-blue-50 text-blue-950 font-bold border-b border-blue-200',
      totalCard: 'bg-blue-50 border border-blue-200',
      border: 'border-slate-200',
    },
    indigo: {
      header: 'bg-indigo-900 text-white p-6 rounded-t-2xl border-b-4 border-indigo-500',
      th: 'bg-indigo-50 text-indigo-950 font-bold border-b border-indigo-200',
      totalCard: 'bg-indigo-50 border border-indigo-200',
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
      header: 'bg-amber-900 text-white p-6 border-b-4 border-amber-500',
      th: 'bg-amber-50 text-slate-900 font-bold border-b-2 border-amber-200',
      totalCard: 'bg-amber-50 border-2 border-amber-300',
      border: 'border-slate-300',
    },
  }[template] || {
    header: 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 rounded-t-2xl',
    th: 'bg-blue-50 text-blue-950 font-bold border-b border-blue-200',
    totalCard: 'bg-blue-50 border border-blue-200',
    border: 'border-slate-200',
  };

  return (
    <div
      id={id}
      className={`print-area w-full max-w-[850px] mx-auto bg-white rounded-2xl shadow-xl border ${themeClasses.border} overflow-hidden text-slate-800 text-xs font-sans transition-all`}
      style={{ minHeight: '1000px' }}
    >
      {/* Header */}
      <div className={themeClasses.header}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-widest uppercase opacity-80">
              Commercial Quotation / Estimate
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{quotation.seller.businessName}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs opacity-90 pt-1">
              {quotation.seller.gstin && <span>GSTIN: {quotation.seller.gstin}</span>}
              {quotation.seller.phone && <span>Ph: {quotation.seller.phone}</span>}
              {quotation.seller.email && <span>Email: {quotation.seller.email}</span>}
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1 bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div className="text-xs font-bold uppercase tracking-wider">Quotation No</div>
            <div className="text-xl font-black">{quotation.quotationNumber}</div>
            <div className="text-xs opacity-90">
              Issue Date: <span className="font-bold">{formatDate(quotation.date)}</span>
            </div>
            {quotation.validUntil && (
              <div className="text-xs opacity-90 text-amber-300 font-bold">
                Valid Until: {formatDate(quotation.validUntil)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parties Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100 bg-slate-50/50">
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Prepared By:</p>
          <p className="font-extrabold text-sm text-slate-900">{quotation.seller.businessName}</p>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">{quotation.seller.address}</p>
          <p className="text-slate-600">
            {quotation.seller.city}, {quotation.seller.state} - {quotation.seller.pincode}
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quotation For (Client):</p>
          <p className="font-extrabold text-sm text-slate-900">{quotation.customerName || 'Prospective Client'}</p>
          {quotation.customerGstin && <p className="text-slate-700 font-bold">GSTIN: {quotation.customerGstin}</p>}
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {quotation.customerAddress || 'Address not specified'}
          </p>
          <div className="pt-1 flex flex-wrap gap-3 text-slate-600">
            {quotation.customerPhone && <span>Phone: {quotation.customerPhone}</span>}
            {quotation.customerEmail && <span>Email: {quotation.customerEmail}</span>}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={themeClasses.th}>
              <th className="py-2.5 px-3 font-bold text-[11px] rounded-l-lg">#</th>
              <th className="py-2.5 px-3 font-bold text-[11px]">Item / Scope of Work</th>
              <th className="py-2.5 px-3 font-bold text-[11px] text-center">HSN/SAC</th>
              <th className="py-2.5 px-3 font-bold text-[11px] text-center">Qty</th>
              <th className="py-2.5 px-3 font-bold text-[11px] text-right">Unit Rate (₹)</th>
              <th className="py-2.5 px-3 font-bold text-[11px] text-center">GST %</th>
              <th className="py-2.5 px-3 font-bold text-[11px] text-right rounded-r-lg">Total Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotation.items.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-slate-50/50">
                <td className="py-3 px-3 text-slate-400 font-medium">{index + 1}</td>
                <td className="py-3 px-3">
                  <p className="font-bold text-slate-900">{item.name}</p>
                  {item.description && <p className="text-[11px] text-slate-500 whitespace-pre-line">{item.description}</p>}
                </td>
                <td className="py-3 px-3 text-center text-slate-600 font-mono text-[11px]">{item.hsnSac || '-'}</td>
                <td className="py-3 px-3 text-center font-medium">
                  {item.quantity} {item.unit?.split(' ')[0]}
                </td>
                <td className="py-3 px-3 text-right font-medium">{formatINR(item.rate, false)}</td>
                <td className="py-3 px-3 text-center">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-[10px]">{item.gstRate}%</span>
                </td>
                <td className="py-3 px-3 text-right font-bold text-slate-900">{formatINR(item.amount, true)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals & Notes Grid */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            {quotation.notes && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Proposal Notes:</p>
                <p className="text-slate-700 mt-1 whitespace-pre-line leading-relaxed">{quotation.notes}</p>
              </div>
            )}
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Total in Words:</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{numberToWordsIndian(quotation.grandTotal)}</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl space-y-2 ${themeClasses.totalCard}`}>
            <div className="flex justify-between text-xs text-slate-700">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatINR(quotation.subtotal)}</span>
            </div>
            {quotation.discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-700">
                <span>Special Discount:</span>
                <span>-{formatINR(quotation.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-slate-700 pt-1 border-t border-slate-200">
              <span>Taxable Total:</span>
              <span className="font-bold">{formatINR(quotation.taxableAmount)}</span>
            </div>
            {(quotation.cgst > 0 || quotation.sgst > 0) && (
              <>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>CGST:</span>
                  <span>{formatINR(quotation.cgst)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>SGST:</span>
                  <span>{formatINR(quotation.sgst)}</span>
                </div>
              </>
            )}
            {quotation.igst > 0 && (
              <div className="flex justify-between text-xs text-slate-700">
                <span>IGST:</span>
                <span>{formatINR(quotation.igst)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t-2 border-slate-300 text-base font-black text-slate-950">
              <span>Estimated Total:</span>
              <span className="text-blue-700">{formatINR(quotation.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Terms and Acceptance */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
          <div className="text-[11px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-900 text-xs">Terms & Conditions:</p>
            <p className="whitespace-pre-line leading-relaxed">{quotation.terms || 'Standard business terms apply.'}</p>
          </div>

          <div className="text-center sm:text-right space-y-6">
            <p className="text-xs font-bold text-slate-900">For {quotation.seller.businessName}</p>
            <div className="pt-6">
              <div className="inline-block border-t border-slate-400 pt-1 px-8 text-[11px] text-slate-500">
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
