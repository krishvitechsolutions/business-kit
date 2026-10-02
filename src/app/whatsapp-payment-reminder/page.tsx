'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { formatINR, formatDate, generateWhatsAppUrl, getCurrentDateISO, getFutureDateISO } from '@/lib/utils';
import { MessageSquare, Send, Copy, Check, Sparkles, Building2, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WhatsAppPaymentReminderPage() {
  const { businessProfile } = useAuth();

  const [customerName, setCustomerName] = useState('Bharat Retail Tech Ltd');
  const [customerPhone, setCustomerPhone] = useState('+919845011223');
  const [amount, setAmount] = useState('76700');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-090');
  const [dueDate, setDueDate] = useState(getFutureDateISO(7));
  const [businessName, setBusinessName] = useState(businessProfile.businessName || 'Apex Infotech Solutions');
  const [upiId, setUpiId] = useState(businessProfile.upiId || 'apexinfotech@hdfcbank');
  const [paymentLink, setPaymentLink] = useState('https://biztools.in/pay/apex');
  const [templateType, setTemplateType] = useState<'friendly' | 'urgent' | 'received' | 'festive'>('friendly');
  const [copied, setCopied] = useState(false);

  // Generate dynamic message body
  const getMessageContent = (): string => {
    const formattedAmount = formatINR(Number(amount) || 0);
    const formattedDue = formatDate(dueDate);

    if (templateType === 'urgent') {
      return `⚠️ *URGENT PAYMENT REMINDER*\n\nDear ${customerName},\n\nThis is an urgent reminder regarding pending Invoice #${invoiceNumber} for *${formattedAmount}* which was due on *${formattedDue}*.\n\nKindly clear the outstanding dues today via UPI to avoid late interest charges:\n📲 *UPI ID:* \`${upiId}\`\n\nOr pay online here: ${paymentLink}\n\nIf you have already processed the payment, please reply with the transaction UTR number.\n\nThank you,\n*${businessName}*`;
    }

    if (templateType === 'received') {
      return `✅ *PAYMENT RECEIVED ACKNOWLEDGEMENT*\n\nDear ${customerName},\n\nWe have successfully received your payment of *${formattedAmount}* against Invoice #${invoiceNumber}.\n\nThank you for your prompt business and continued association!\n\nBest regards,\n*${businessName}*`;
    }

    if (templateType === 'festive') {
      return `✨ *FESTIVE GREETINGS & SPECIAL OFFER*\n\nDear ${customerName},\n\nWishing you and your team a prosperous festive season!\n\nAs a valued partner, we are offering an exclusive 15% discount on all new service renewals this month.\n\nFor any inquiries or invoice support:\n📞 WhatsApp: ${businessProfile.phone}\n\nWarm regards,\n*${businessName}*`;
    }

    // Default Friendly
    return `Hello ${customerName},\n\nHope you are doing well!\n\nThis is a polite reminder for Invoice #${invoiceNumber}.\n\n💵 *Amount Due:* ${formattedAmount}\n📅 *Due Date:* ${formattedDue}\n\nYou can make the payment instantly using UPI:\n📲 *UPI ID:* \`${upiId}\`\n\nPayment Link: ${paymentLink}\n\nThank you for your business!\n\nBest regards,\n*${businessName}*`;
  };

  const messageText = getMessageContent();

  const handleSendWhatsApp = () => {
    const waUrl = generateWhatsAppUrl(customerPhone, messageText);
    window.open(waUrl, '_blank');
    confetti({ particleCount: 35, spread: 50 });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Business Engagement</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          WhatsApp Payment Reminder Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Generate professional, formatted WhatsApp messages with one-click instant send to collect customer payments 3x faster.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Template Choices */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Message Style & Tone
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'friendly', name: 'Polite Reminder', desc: 'Standard friendly notice' },
                { id: 'urgent', name: 'Urgent Overdue', desc: 'Firm follow-up for delayed bills' },
                { id: 'received', name: 'Payment Receipt', desc: 'Instant thank you note' },
                { id: 'festive', name: 'Festive Greeting', desc: 'Special offers & greetings' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplateType(t.id as any)}
                  className={`p-3 rounded-xl text-left transition border ${
                    templateType === t.id
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold text-xs">{t.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer / Client Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer WhatsApp Number *</label>
                <input
                  type="tel"
                  placeholder="+919876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount Due (₹) *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Invoice Number *</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">UPI ID (for Direct Pay) *</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Phone WhatsApp Chat Mockup */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center">
            {/* Phone Screen Mockup */}
            <div className="w-full max-w-sm rounded-[32px] border-4 border-slate-800 bg-[#EFEAE2] p-4 shadow-2xl overflow-hidden text-xs">
              {/* WhatsApp Header */}
              <div className="bg-[#075E54] -mx-4 -mt-4 p-3.5 text-white flex items-center justify-between mb-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-800 font-bold flex items-center justify-center text-xs">
                    {customerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold leading-none text-xs">{customerName}</p>
                    <p className="text-[10px] text-emerald-200 mt-0.5">Online</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-200 font-mono">{customerPhone}</span>
              </div>

              {/* Chat Bubble */}
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm text-slate-800 space-y-2 whitespace-pre-line text-xs leading-relaxed border border-slate-200/40">
                {messageText}
                <div className="text-right text-[10px] text-slate-400 pt-1">
                  10:30 AM <span className="text-blue-500 font-bold">✓✓</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full max-w-sm space-y-2 pt-6">
              <button
                onClick={handleSendWhatsApp}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>Send on WhatsApp</span>
              </button>

              <button
                onClick={handleCopy}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text Message'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
