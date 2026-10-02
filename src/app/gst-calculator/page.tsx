'use client';

import React, { useState } from 'react';
import { formatINR } from '@/lib/utils';
import { GST_RATES } from '@/lib/constants';
import { Percent, Calculator, ArrowRight, ShieldCheck, HelpCircle, Check } from 'lucide-react';
import AdBanner from '@/components/layout/AdBanner';

export default function GSTCalculatorPage() {
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [amount, setAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isInterState, setIsInterState] = useState<boolean>(false);

  // Calculations
  let baseAmount = 0;
  let gstAmount = 0;
  let finalAmount = 0;

  if (mode === 'add') {
    baseAmount = amount;
    gstAmount = (baseAmount * gstRate) / 100;
    finalAmount = baseAmount + gstAmount;
  } else {
    finalAmount = amount;
    baseAmount = finalAmount / (1 + gstRate / 100);
    gstAmount = finalAmount - baseAmount;
  }

  const cgst = isInterState ? 0 : gstAmount / 2;
  const sgst = isInterState ? 0 : gstAmount / 2;
  const igst = isInterState ? gstAmount : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
          <Percent className="w-4 h-4" />
          <span>Indian Goods & Services Tax (GST) Suite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          GST Calculator (Add / Remove Reverse GST)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Instantly add GST to net prices or reverse-calculate base prices and tax components from MRP for 0%, 5%, 12%, 18%, and 28% slabs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Modes & Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            {/* Mode Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Calculation Mode
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setMode('add')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition ${
                    mode === 'add' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1. Add GST (Exclusive Price)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('remove')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition ${
                    mode === 'remove' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2. Remove GST (Inclusive MRP)
                </button>
              </div>
            </div>

            {/* Input Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {mode === 'add' ? 'Initial Net Amount (₹) *' : 'Gross MRP Amount (₹) *'}
              </label>
              <input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* GST Rate Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">GST Rate Slab (%)</label>
              <div className="grid grid-cols-5 gap-2">
                {GST_RATES.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setGstRate(rate)}
                    className={`py-3 rounded-xl text-xs font-black transition border ${
                      gstRate === rate
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* Inter-State Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Supply Destination</p>
                <p className="text-[11px] text-slate-500">
                  {isInterState ? 'Inter-State Transaction (IGST)' : 'Intra-State Transaction (CGST + SGST)'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInterState(!isInterState)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isInterState ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {isInterState ? 'IGST Active' : 'CGST/SGST'}
              </button>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl text-xs space-y-2 text-emerald-950">
            <h4 className="font-bold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>Calculation Formula Explained:</span>
            </h4>
            {mode === 'add' ? (
              <div className="space-y-1 text-emerald-900">
                <p><strong>GST Amount</strong> = Base Price × (GST Rate ÷ 100) = {formatINR(baseAmount)} × ({gstRate} ÷ 100) = {formatINR(gstAmount)}</p>
                <p><strong>Gross Final Total</strong> = Base Price + GST Amount = {formatINR(finalAmount)}</p>
              </div>
            ) : (
              <div className="space-y-1 text-emerald-900">
                <p><strong>Original Base Price</strong> = Gross Amount ÷ (1 + (GST Rate ÷ 100)) = {formatINR(finalAmount)} ÷ (1 + {gstRate / 100}) = {formatINR(baseAmount)}</p>
                <p><strong>Extracted GST Amount</strong> = Gross Amount − Base Price = {formatINR(gstAmount)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Outputs Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 uppercase tracking-wider text-xs">
              GST Calculation Result
            </h3>

            {/* Big Final Total Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center space-y-1 shadow-lg shadow-emerald-500/10">
              <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
                {mode === 'add' ? 'Total Payable / Gross Price (Incl. GST)' : 'Final MRP Total'}
              </span>
              <p className="text-3xl sm:text-4xl font-black">{formatINR(finalAmount)}</p>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Base / Pre-Tax Amount:</span>
                <span className="font-bold text-slate-900 text-sm">{formatINR(baseAmount)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Total GST Tax ({gstRate}%):</span>
                <span className="font-bold text-emerald-700 text-sm">{formatINR(gstAmount)}</span>
              </div>

              {isInterState ? (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Integrated GST (IGST {gstRate}%):</span>
                  <span className="font-semibold text-blue-700">{formatINR(igst)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Central GST (CGST {(gstRate / 2).toFixed(1)}%):</span>
                    <span className="font-semibold text-slate-800">{formatINR(cgst)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">State GST (SGST {(gstRate / 2).toFixed(1)}%):</span>
                    <span className="font-semibold text-slate-800">{formatINR(sgst)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <AdBanner slot="calculator-result" />
        </div>
      </div>
    </div>
  );
}
