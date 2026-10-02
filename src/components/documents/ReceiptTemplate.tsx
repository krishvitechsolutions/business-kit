'use client';

import React from 'react';
import { Receipt } from '@/lib/types';
import { formatINR, formatDate, numberToWordsIndian } from '@/lib/utils';
import { CheckCircle2, Receipt as ReceiptIcon } from 'lucide-react';

interface ReceiptTemplateProps {
  receipt: Receipt;
  id?: string;
}

export default function ReceiptTemplate({ receipt, id = 'receipt-document' }: ReceiptTemplateProps) {
  return (
    <div
      id={id}
      className="print-area w-full max-w-[700px] mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-slate-800 text-xs font-sans transition-all"
    >
      {/* Receipt Top Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-t-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/20">
                <ReceiptIcon className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold tracking-widest uppercase opacity-90">
                Official Payment Receipt
              </span>
            </div>
            <h1 className="text-2xl font-black mt-1">{receipt.seller.businessName}</h1>
            <p className="text-xs opacity-90">
              {receipt.seller.city}, {receipt.seller.state} | Ph: {receipt.seller.phone}
            </p>
          </div>

          <div className="text-left sm:text-right bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div className="text-[11px] uppercase tracking-wider font-bold opacity-80">Receipt No</div>
            <div className="text-xl font-black">{receipt.receiptNumber}</div>
            <div className="text-xs opacity-90">
              Date: <span className="font-bold">{formatDate(receipt.date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Receipt Body */}
      <div className="p-6 space-y-6">
        {/* Status Badge & Amount Received Box */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Payment Received Successfully</p>
              <p className="text-xs text-emerald-700">Thank you for your payment</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-emerald-800 font-bold uppercase">Amount Received</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-950">{formatINR(receipt.amountReceived)}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 font-medium">Received From (Customer):</span>
            <p className="font-bold text-slate-900 text-sm">{receipt.customerName}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 font-medium">Payment Mode:</span>
            <p className="font-bold text-slate-900 text-sm">{receipt.paymentMethod}</p>
          </div>

          {receipt.invoiceNumber && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-medium">Against Invoice Reference:</span>
              <p className="font-bold text-blue-700 text-sm font-mono">{receipt.invoiceNumber}</p>
            </div>
          )}

          {receipt.paymentReference && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-medium">Transaction / UTR Reference:</span>
              <p className="font-bold text-slate-900 text-sm font-mono">{receipt.paymentReference}</p>
            </div>
          )}
        </div>

        {/* Amount In Words */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Amount in Words:</span>
          <p className="font-bold text-slate-900 text-xs mt-0.5">{numberToWordsIndian(receipt.amountReceived)}</p>
        </div>

        {receipt.notes && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
            <span className="font-bold text-slate-800">Notes / Remarks:</span>
            <p className="mt-0.5">{receipt.notes}</p>
          </div>
        )}

        {/* Signature */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            <p>Received By: <strong className="text-slate-800">{receipt.receivedBy || receipt.seller.ownerName}</strong></p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900">For {receipt.seller.businessName}</p>
            <div className="mt-6 border-t border-slate-400 pt-1 px-6 text-[10px] text-slate-500">
              Authorized Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
