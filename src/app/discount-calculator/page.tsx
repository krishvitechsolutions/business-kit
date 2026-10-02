'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Tag,
  Calculator,
  Percent,
  Sparkles,
  ShoppingBag,
  TrendingDown,
  Copy,
  Check,
  ArrowRight,
  Info,
  Gift,
  Coins,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import confetti from 'canvas-confetti';
import AdBanner from '@/components/layout/AdBanner';

export default function DiscountCalculatorPage() {
  const [discountType, setDiscountType] = useState<'standard' | 'multi' | 'bogo' | 'cash'>('standard');

  // Mode 1: Standard Single Discount
  const [originalPrice, setOriginalPrice] = useState<number>(2499);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [flatDiscount, setFlatDiscount] = useState<number>(0);
  const [includeGst, setIncludeGst] = useState<boolean>(false);
  const [gstRate, setGstRate] = useState<number>(18);

  // Mode 2: Multi-Tier / Cascading (e.g., 20% + 10% scheme)
  const [multiPrice, setMultiPrice] = useState<number>(5000);
  const [tier1, setTier1] = useState<number>(20);
  const [tier2, setTier2] = useState<number>(10);
  const [tier3, setTier3] = useState<number>(5);

  // Mode 3: Buy X Get Y Free
  const [buyQty, setBuyQty] = useState<number>(3);
  const [getQty, setGetQty] = useState<number>(1);
  const [unitPriceBogo, setUnitPriceBogo] = useState<number>(600);

  // Mode 4: Cash Discount for Early Payment (e.g., 2/10 Net 30)
  const [invoiceVal, setInvoiceVal] = useState<number>(150000);
  const [cashDiscountPercent, setCashDiscountPercent] = useState<number>(2);

  const [copied, setCopied] = useState(false);

  // Calculations for Standard
  const standardSavings = (originalPrice * discountPercent) / 100 + flatDiscount;
  const standardDiscountedPrice = Math.max(0, originalPrice - standardSavings);
  const standardGstAmount = includeGst ? (standardDiscountedPrice * gstRate) / 100 : 0;
  const standardFinalPrice = Math.round(standardDiscountedPrice + standardGstAmount);
  const standardEffectiveDiscount = originalPrice > 0 ? (standardSavings / originalPrice) * 100 : 0;

  // Calculations for Multi-Tier
  const multiStep1 = multiPrice * (1 - tier1 / 100);
  const multiStep2 = multiStep1 * (1 - tier2 / 100);
  const multiFinal = multiStep2 * (1 - tier3 / 100);
  const multiTotalSavings = multiPrice - multiFinal;
  const multiEffectivePercent = multiPrice > 0 ? (multiTotalSavings / multiPrice) * 100 : 0;

  // Calculations for BOGO
  const bogoTotalItems = buyQty + getQty;
  const bogoTotalBill = buyQty * unitPriceBogo;
  const bogoEffectivePricePerUnit = bogoTotalItems > 0 ? bogoTotalBill / bogoTotalItems : 0;
  const bogoFreeValue = getQty * unitPriceBogo;
  const bogoEffectiveDiscountPercent =
    bogoTotalItems > 0 ? (bogoFreeValue / (bogoTotalItems * unitPriceBogo)) * 100 : 0;

  // Calculations for Cash Discount
  const cashSavings = (invoiceVal * cashDiscountPercent) / 100;
  const cashPayable = Math.max(0, invoiceVal - cashSavings);

  const handleCopySummary = () => {
    let text = '';
    if (discountType === 'standard') {
      text = `🏷️ Discount Calculation (BizTools India)
Original Price: ${formatINR(originalPrice)}
Discount: ${discountPercent}% off ${flatDiscount > 0 ? `+ ${formatINR(flatDiscount)} flat` : ''}
Total Savings: ${formatINR(standardSavings)} (${standardEffectiveDiscount.toFixed(1)}% off)
Final Payable Price: ${formatINR(standardFinalPrice)}`;
    } else if (discountType === 'multi') {
      text = `🏷️ Multi-Tier Discount (BizTools India)
Original MRP: ${formatINR(multiPrice)}
Tier Scheme: ${tier1}% + ${tier2}% + ${tier3}%
Effective Combined Discount: ${multiEffectivePercent.toFixed(1)}%
Total Savings: ${formatINR(multiTotalSavings)}
Final Price: ${formatINR(multiFinal)}`;
    } else if (discountType === 'bogo') {
      text = `🏷️ Buy ${buyQty} Get ${getQty} Free Deal (BizTools India)
Total Items Received: ${bogoTotalItems} units
You Pay for: ${buyQty} units (${formatINR(bogoTotalBill)})
Free Value: ${formatINR(bogoFreeValue)}
Effective Price per Item: ${formatINR(bogoEffectivePricePerUnit)} (Effective ${bogoEffectiveDiscountPercent.toFixed(1)}% off)`;
    } else {
      text = `🏷️ Early Payment Cash Discount (BizTools India)
Invoice Total: ${formatINR(invoiceVal)}
Early Payment Discount (${cashDiscountPercent}%): -${formatINR(cashSavings)}
Net Remittance: ${formatINR(cashPayable)}`;
    }

    text += `\n\nCalculated free at https://biztools.in/discount-calculator`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4" />
            <span>Retail & Wholesale Pricing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Discount & Bulk Pricing Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Calculate instant percentage discounts, multi-tier retail schemes (20% + 10% off), Buy X Get Y Free offers, and cash discounts.
          </p>
        </div>

        <button
          onClick={handleCopySummary}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold text-xs border border-rose-200 shadow-xs transition self-start md:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-rose-700" />}
          <span>{copied ? 'Copied Offer!' : 'Copy Offer Details'}</span>
        </button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'standard', label: 'Single / Flat Discount', icon: Tag },
          { id: 'multi', label: 'Multi-Tier (20% + 10%)', icon: Sparkles },
          { id: 'bogo', label: 'Buy X Get Y Free', icon: Gift },
          { id: 'cash', label: 'Cash / Early Payment', icon: Coins },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setDiscountType(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${
                discountType === tab.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* Mode 1: Standard */}
            {discountType === 'standard' && (
              <>
                <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-rose-600" />
                  <span>Standard Price & Percentage Discount</span>
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Original MRP / Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700">Discount Percentage (%)</span>
                      <span className="text-rose-600 font-black text-sm">{discountPercent}% OFF</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      step="1"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                    <div className="flex gap-2">
                      {[10, 15, 20, 25, 30, 40, 50].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setDiscountPercent(p)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                            discountPercent === p
                              ? 'bg-rose-50 border-rose-400 text-rose-700'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {p}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Additional Flat Coupon / Cash Off (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={flatDiscount || ''}
                        onChange={(e) => setFlatDiscount(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* GST Addition Option */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Add GST on Discounted Price?</span>
                      <span className="text-[11px] text-slate-500">Calculate final price including GST tax.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIncludeGst(!includeGst)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        includeGst ? 'bg-rose-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                          includeGst ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {includeGst && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">GST Rate (%)</label>
                      <select
                        value={gstRate}
                        onChange={(e) => setGstRate(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                      >
                        {[5, 12, 18, 28].map((r) => (
                          <option key={r} value={r}>
                            {r}% GST
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mode 2: Multi-Tier */}
            {discountType === 'multi' && (
              <>
                <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-600" />
                  <span>Cascading / Multi-Tier Discount Scheme</span>
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Original MRP / Base Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        value={multiPrice}
                        onChange={(e) => setMultiPrice(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">1st Tier (%)</label>
                      <input
                        type="number"
                        value={tier1}
                        onChange={(e) => setTier1(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">2nd Tier (%)</label>
                      <input
                        type="number"
                        value={tier2}
                        onChange={(e) => setTier2(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">3rd Tier (%)</label>
                      <input
                        type="number"
                        value={tier3}
                        onChange={(e) => setTier3(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    💡 <strong>How it works:</strong> Tier 1 applies to original price, Tier 2 applies to the reduced price, and Tier 3 applies to the remaining balance. (20% + 10% is equal to 28% total discount, not 30%!)
                  </p>
                </div>
              </>
            )}

            {/* Mode 3: BOGO */}
            {discountType === 'bogo' && (
              <>
                <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-rose-600" />
                  <span>Buy X Get Y Free Deal Valuation</span>
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Buy Quantity (Paid)</label>
                      <input
                        type="number"
                        value={buyQty}
                        onChange={(e) => setBuyQty(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Get Quantity (Free)</label>
                      <input
                        type="number"
                        value={getQty}
                        onChange={(e) => setGetQty(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Single Item MRP (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        value={unitPriceBogo}
                        onChange={(e) => setUnitPriceBogo(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Mode 4: Cash Discount */}
            {discountType === 'cash' && (
              <>
                <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-rose-600" />
                  <span>Early Payment Cash Discount (B2B Credit)</span>
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Invoice Value (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        value={invoiceVal}
                        onChange={(e) => setInvoiceVal(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cash Discount Rate (%)</label>
                    <div className="flex gap-2">
                      {[1, 1.5, 2, 2.5, 3, 5].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setCashDiscountPercent(r)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            cashDiscountPercent === r
                              ? 'bg-rose-50 border-rose-400 text-rose-700'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {r}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-rose-600 via-rose-700 to-pink-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-200 bg-rose-900/60 px-2.5 py-1 rounded-full">
                Savings Summary
              </span>
              <h3 className="text-lg font-bold text-white mt-3">Final Discounted Outcome</h3>
            </div>

            {/* Standard Output */}
            {discountType === 'standard' && (
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-xs">
                  <p className="text-xs text-rose-200">Customer Pays (Final Price)</p>
                  <p className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                    {formatINR(standardFinalPrice)}
                  </p>
                  {includeGst && (
                    <p className="text-[11px] text-rose-200 mt-1">
                      Includes {formatINR(standardGstAmount)} GST ({gstRate}%)
                    </p>
                  )}
                </div>

                <div className="bg-rose-950/60 p-4 rounded-2xl border border-rose-400/30">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-rose-200">Total Money Saved:</span>
                    <span className="text-2xl font-black text-emerald-300">{formatINR(standardSavings)}</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-1 text-xs text-rose-200">
                    <span>Effective Discount:</span>
                    <span className="font-bold text-white">{standardEffectiveDiscount.toFixed(1)}% OFF</span>
                  </div>
                </div>
              </div>
            )}

            {/* Multi-Tier Output */}
            {discountType === 'multi' && (
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-xs">
                  <p className="text-xs text-rose-200">Final Price to Pay</p>
                  <p className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                    {formatINR(multiFinal)}
                  </p>
                  <p className="text-[11px] text-rose-200 mt-1">
                    Effective Combined Discount: <strong>{multiEffectivePercent.toFixed(1)}%</strong>
                  </p>
                </div>

                <div className="bg-rose-950/60 p-4 rounded-2xl border border-rose-400/30">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-rose-200">Total Customer Savings:</span>
                    <span className="text-2xl font-black text-emerald-300">{formatINR(multiTotalSavings)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* BOGO Output */}
            {discountType === 'bogo' && (
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-xs">
                  <p className="text-xs text-rose-200">Total Bill for {bogoTotalItems} Items</p>
                  <p className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                    {formatINR(bogoTotalBill)}
                  </p>
                  <p className="text-[11px] text-rose-200 mt-1">
                    Effective Price per Unit: <strong>{formatINR(bogoEffectivePricePerUnit)}</strong> (was {formatINR(unitPriceBogo)})
                  </p>
                </div>

                <div className="bg-rose-950/60 p-4 rounded-2xl border border-rose-400/30">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-rose-200">Value of Free Items:</span>
                    <span className="text-2xl font-black text-emerald-300">{formatINR(bogoFreeValue)}</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-1 text-xs text-rose-200">
                    <span>Effective Discount:</span>
                    <span className="font-bold text-white">{bogoEffectiveDiscountPercent.toFixed(1)}% OFF</span>
                  </div>
                </div>
              </div>
            )}

            {/* Cash Discount Output */}
            {discountType === 'cash' && (
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-xs">
                  <p className="text-xs text-rose-200">Net Remittance Amount</p>
                  <p className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-300 mt-1">
                    {formatINR(cashPayable)}
                  </p>
                  <p className="text-[11px] text-rose-200 mt-1">
                    Discount for settling bill within agreed early term.
                  </p>
                </div>

                <div className="bg-rose-950/60 p-4 rounded-2xl border border-rose-400/30">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-rose-200">Cash Saved:</span>
                    <span className="text-2xl font-black text-emerald-300">{formatINR(cashSavings)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Create Invoices with Discounts</h4>
            <div className="space-y-2">
              <Link
                href="/gst-invoice-generator"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-bold text-slate-800 hover:text-blue-700 transition"
              >
                <span>Make GST Invoice with Item Discounts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quotation-maker"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-bold text-slate-800 hover:text-blue-700 transition"
              >
                <span>Send Quotation with Special Offer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AdBanner slot="content-bottom" />
    </div>
  );
}
