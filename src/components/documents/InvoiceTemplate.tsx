'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Invoice } from '@/lib/types';
import { formatINR, formatDate, generateUPIUrl } from '@/lib/utils';
import { Building2, Phone, Mail, Globe, MapPin, Landmark, CheckCircle2 } from 'lucide-react';

interface InvoiceTemplateProps {
  invoice: Invoice;
  id?: string;
}

export default function InvoiceTemplate({ invoice, id = 'invoice-document' }: InvoiceTemplateProps) {
  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (invoice.seller.upiId && invoice.seller.upiQrEnabled !== false) {
      const upiString = generateUPIUrl({
        upiId: invoice.seller.upiId,
        payeeName: invoice.seller.businessName || 'Business Payee',
        amount: invoice.grandTotal > 0 ? invoice.grandTotal : undefined,
        note: `Inv ${invoice.invoiceNumber}`,
      });

      QRCode.toDataURL(upiString, {
        width: 160,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setUpiQrDataUrl(url))
        .catch((err) => console.error('QR generation error', err));
    } else {
      setUpiQrDataUrl('');
    }
  }, [invoice.seller.upiId, invoice.seller.upiQrEnabled, invoice.grandTotal, invoice.invoiceNumber, invoice.seller.businessName]);

  const template = invoice.templateId || 'modern';

  // Base theme accent colors
  const themeClasses = {
    modern: {
      header: 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 rounded-t-2xl',
      title: 'text-white',
      accentText: 'text-blue-600',
      th: 'bg-blue-50 text-blue-900 border-b border-blue-200',
      totalCard: 'bg-blue-50/80 border border-blue-200 text-blue-950',
      border: 'border-slate-200',
      pill: 'bg-blue-100 text-blue-800',
    },
    indigo: {
      header: 'bg-slate-900 text-white p-6 rounded-t-2xl border-b-4 border-indigo-500',
      title: 'text-white',
      accentText: 'text-indigo-600',
      th: 'bg-indigo-50 text-indigo-900 border-b border-indigo-200',
      totalCard: 'bg-indigo-50/80 border border-indigo-200 text-indigo-950',
      border: 'border-slate-200',
      pill: 'bg-indigo-100 text-indigo-800',
    },
    classic: {
      header: 'bg-white text-slate-900 p-6 border-b-2 border-slate-900',
      title: 'text-slate-900',
      accentText: 'text-slate-900',
      th: 'bg-slate-100 text-slate-900 border-b-2 border-slate-300 font-bold',
      totalCard: 'bg-slate-50 border-2 border-slate-300 text-slate-950',
      border: 'border-slate-300',
      pill: 'bg-slate-200 text-slate-800',
    },
    minimal: {
      header: 'bg-white text-slate-900 p-6 border-b border-slate-200',
      title: 'text-slate-900',
      accentText: 'text-slate-800',
      th: 'bg-slate-50 text-slate-700 border-b border-slate-200 uppercase text-[10px]',
      totalCard: 'bg-slate-50 border border-slate-200 text-slate-900',
      border: 'border-slate-200',
      pill: 'bg-slate-100 text-slate-700',
    },
    bordered: {
      header: 'bg-blue-900 text-white p-6 border-b-4 border-amber-500',
      title: 'text-white',
      accentText: 'text-blue-900',
      th: 'bg-amber-50 text-slate-900 border-b-2 border-amber-200 font-bold',
      totalCard: 'bg-amber-50/70 border-2 border-amber-300 text-slate-900',
      border: 'border-slate-300',
      pill: 'bg-amber-100 text-amber-900',
    },
  }[template] || {
    header: 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 rounded-t-2xl',
    title: 'text-white',
    accentText: 'text-blue-600',
    th: 'bg-blue-50 text-blue-900 border-b border-blue-200',
    totalCard: 'bg-blue-50/80 border border-blue-200 text-blue-950',
    border: 'border-slate-200',
    pill: 'bg-blue-100 text-blue-800',
  };

  return (
    <div
      id={id}
      className={`print-area w-full max-w-[850px] mx-auto bg-white rounded-2xl shadow-xl border ${themeClasses.border} overflow-hidden text-slate-800 text-xs font-sans transition-all`}
      style={{ minHeight: '1050px' }}
    >
      {/* Document Header */}
      <div className={themeClasses.header}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-widest uppercase opacity-80">
              Tax Invoice / Bill of Supply
            </span>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${themeClasses.title}`}>
              {invoice.seller.businessName || 'Your Business Name'}
            </h1>
            {invoice.seller.tagline && (
              <p className="text-xs opacity-90">{invoice.seller.tagline}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs opacity-90 pt-1">
              {invoice.seller.gstin && (
                <span className="font-bold">GSTIN: {invoice.seller.gstin}</span>
              )}
              {invoice.seller.pan && <span>PAN: {invoice.seller.pan}</span>}
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1 bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div className="text-xs font-extrabold uppercase tracking-wider">Invoice No</div>
            <div className="text-xl font-black">{invoice.invoiceNumber || 'INV-001'}</div>
            <div className="text-xs opacity-90">
              Date: <span className="font-bold">{formatDate(invoice.invoiceDate)}</span>
            </div>
            {invoice.dueDate && (
              <div className="text-xs opacity-90">
                Due: <span className="font-bold">{formatDate(invoice.dueDate)}</span>
              </div>
            )}
            <div className="pt-1">
              <span
                className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  invoice.status === 'paid'
                    ? 'bg-emerald-500 text-white'
                    : invoice.status === 'sent'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                {invoice.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Seller & Customer Details Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100 bg-slate-50/50">
        {/* Billed By (Seller) */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Billed By (Seller):</p>
          <p className="font-extrabold text-sm text-slate-900">{invoice.seller.businessName}</p>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">{invoice.seller.address}</p>
          <p className="text-slate-600">
            {invoice.seller.city}, {invoice.seller.state} - {invoice.seller.pincode}
          </p>
          <div className="pt-1 space-y-0.5 text-slate-600">
            {invoice.seller.phone && <p>Phone: {invoice.seller.phone}</p>}
            {invoice.seller.email && <p>Email: {invoice.seller.email}</p>}
          </div>
        </div>

        {/* Billed To (Customer) */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Billed To (Customer):</p>
          <p className="font-extrabold text-sm text-slate-900">{invoice.customerName || 'Customer / Client Name'}</p>
          {invoice.customerGstin && (
            <p className="font-bold text-slate-800">GSTIN: {invoice.customerGstin}</p>
          )}
          {invoice.customerAddress ? (
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{invoice.customerAddress}</p>
          ) : (
            <p className="text-slate-400 italic">Address not specified</p>
          )}
          <p className="text-slate-600">
            {invoice.customerCity ? `${invoice.customerCity}, ` : ''}
            {invoice.customerState || 'State'}{' '}
            {invoice.customerPincode ? `- ${invoice.customerPincode}` : ''}
          </p>
          <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-slate-600">
            {invoice.customerPhone && <p>Phone: {invoice.customerPhone}</p>}
            {invoice.placeOfSupply && (
              <p className="font-semibold text-slate-800">
                Place of Supply: <span className="text-blue-700">{invoice.placeOfSupply}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Product / Line Items Table */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={themeClasses.th}>
                <th className="py-2.5 px-3 font-bold text-[11px] rounded-l-lg">#</th>
                <th className="py-2.5 px-3 font-bold text-[11px]">Item & Description</th>
                <th className="py-2.5 px-3 font-bold text-[11px] text-center">HSN/SAC</th>
                <th className="py-2.5 px-3 font-bold text-[11px] text-center">Qty & Unit</th>
                <th className="py-2.5 px-3 font-bold text-[11px] text-right">Rate (₹)</th>
                <th className="py-2.5 px-3 font-bold text-[11px] text-center">GST %</th>
                <th className="py-2.5 px-3 font-bold text-[11px] text-right rounded-r-lg">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 px-3 text-slate-400 font-medium">{index + 1}</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                    {item.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5 whitespace-pre-line">{item.description}</p>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-600 font-mono text-[11px]">
                    {item.hsnSac || '-'}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-700 font-medium">
                    {item.quantity} <span className="text-[10px] text-slate-500">{item.unit.split(' ')[0]}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-800">
                    {formatINR(item.rate, false)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-bold text-[10px] text-slate-700">
                      {item.gstRate}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    {formatINR(item.amount, true)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary & Tax Breakdown Grid */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Column: Bank Details & UPI QR */}
          <div className="space-y-4">
            {/* Bank Details Box */}
            {invoice.bankDetails?.accountNumber && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Landmark className="w-4 h-4 text-blue-600" />
                  <span>Bank Payment Details</span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400">Bank:</span> {invoice.bankDetails.bankName}
                  </div>
                  <div>
                    <span className="text-slate-400">A/C No:</span> <strong className="font-mono text-slate-800">{invoice.bankDetails.accountNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">IFSC:</span> <strong className="font-mono text-slate-800">{invoice.bankDetails.ifsc}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Holder:</span> {invoice.bankDetails.holderName}
                  </div>
                </div>
              </div>
            )}

            {/* UPI QR Code */}
            {upiQrDataUrl && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <img
                  src={upiQrDataUrl}
                  alt="UPI QR Code"
                  className="w-20 h-20 rounded-lg border border-slate-200 bg-white p-1"
                />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900">Scan & Pay via UPI</p>
                  <p className="text-[11px] text-slate-600">GPay, PhonePe, Paytm, BHIM</p>
                  <p className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded inline-block">
                    {invoice.seller.upiId}
                  </p>
                </div>
              </div>
            )}

            {/* Amount In Words */}
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Amount In Words:</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{invoice.amountInWords}</p>
            </div>
          </div>

          {/* Right Column: Calculations */}
          <div className={`p-4 rounded-xl space-y-2.5 ${themeClasses.totalCard}`}>
            <div className="flex justify-between text-xs text-slate-700">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatINR(invoice.subtotal)}</span>
            </div>

            {invoice.totalDiscount > 0 && (
              <div className="flex justify-between text-xs text-emerald-700 font-medium">
                <span>Total Discount:</span>
                <span>-{formatINR(invoice.totalDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-slate-700 pt-1 border-t border-slate-200">
              <span className="font-semibold">Taxable Amount:</span>
              <span className="font-bold">{formatINR(invoice.taxableAmount)}</span>
            </div>

            {/* GST Breakdown: CGST + SGST or IGST */}
            {invoice.isInterState ? (
              <div className="flex justify-between text-xs text-slate-700">
                <span>Integrated GST (IGST):</span>
                <span className="font-semibold">{formatINR(invoice.igst)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Central GST (CGST):</span>
                  <span className="font-semibold">{formatINR(invoice.cgst)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>State GST (SGST):</span>
                  <span className="font-semibold">{formatINR(invoice.sgst)}</span>
                </div>
              </>
            )}

            {invoice.roundOff !== 0 && (
              <div className="flex justify-between text-xs text-slate-500">
                <span>Round Off:</span>
                <span>{formatINR(invoice.roundOff)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t-2 border-slate-300 text-sm sm:text-base font-black text-slate-950">
              <span>Grand Total:</span>
              <span className="text-blue-700">{formatINR(invoice.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Terms & Conditions & Signatures */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
          <div className="space-y-1.5 text-[11px] text-slate-600">
            <p className="font-bold text-slate-900 text-xs">Terms & Conditions:</p>
            <p className="whitespace-pre-line leading-relaxed">{invoice.terms}</p>
            {invoice.notes && (
              <div className="pt-2">
                <p className="font-bold text-slate-900 text-xs">Notes:</p>
                <p className="italic text-slate-500">{invoice.notes}</p>
              </div>
            )}
          </div>

          <div className="text-center sm:text-right space-y-8">
            <div>
              <p className="text-xs font-bold text-slate-900">For {invoice.seller.businessName}</p>
            </div>
            <div className="pt-6">
              <div className="inline-block border-t border-slate-400 pt-1 px-8 text-[11px] text-slate-500">
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding for Free Tier / Pro notice */}
      <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-[10px] text-slate-500 flex items-center justify-between px-6">
        <span>This is a computer-generated GST tax invoice.</span>
        <span className="font-semibold text-blue-700">Generated via BizTools India (biztools.in)</span>
      </div>
    </div>
  );
}
