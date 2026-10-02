'use client';

import React, { useState } from 'react';
import { formatINR } from '@/lib/utils';
import { GST_RATES } from '@/lib/constants';
import { TrendingUp, Calculator, DollarSign, Percent, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import AdBanner from '@/components/layout/AdBanner';

export default function ProfitMarginCalculatorPage() {
  const [costPrice, setCostPrice] = useState<number>(450);
  const [sellingPrice, setSellingPrice] = useState<number>(799);
  const [quantity, setQuantity] = useState<number>(50);
  const [extraExpensePerUnit, setExtraExpensePerUnit] = useState<number>(30); // packaging, shipping
  const [gstRate, setGstRate] = useState<number>(18);
  const [isGstInclusive, setIsGstInclusive] = useState<boolean>(true);

  // Calculations
  const effectiveSellingPrice = isGstInclusive
    ? sellingPrice / (1 + gstRate / 100)
    : sellingPrice;

  const gstAmountPerUnit = isGstInclusive
    ? sellingPrice - effectiveSellingPrice
    : (sellingPrice * gstRate) / 100;

  const totalCostPerUnit = Number(costPrice) + Number(extraExpensePerUnit);
  const profitPerUnit = effectiveSellingPrice - totalCostPerUnit;

  const totalRevenue = (isGstInclusive ? sellingPrice : sellingPrice + gstAmountPerUnit) * quantity;
  const totalCost = totalCostPerUnit * quantity;
  const totalNetProfit = profitPerUnit * quantity;

  const profitMarginPercent = effectiveSellingPrice > 0 ? (profitPerUnit / effectiveSellingPrice) * 100 : 0;
  const markupPercent = totalCostPerUnit > 0 ? (profitPerUnit / totalCostPerUnit) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>Product Pricing & Profitability Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Profit Margin & Markup Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Accurately calculate gross profit, net margin %, markup %, and break-even pricing including GST and fulfillment costs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>Unit Cost & Selling Price Parameters</span>
            </h3>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">Cost Price per Unit (₹) *</label>
                <span className="text-xs font-mono font-bold text-slate-900">{formatINR(costPrice)}</span>
              </div>
              <input
                type="number"
                min={0}
                value={costPrice}
                onChange={(e) => setCostPrice(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">Selling Price (MRP) per Unit (₹) *</label>
                <span className="text-xs font-mono font-bold text-blue-700">{formatINR(sellingPrice)}</span>
              </div>
              <input
                type="number"
                min={0}
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Units Sold / Batch Qty</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Shipping / Packing / Fees (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={extraExpensePerUnit}
                  onChange={(e) => setExtraExpensePerUnit(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* GST Settings */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">GST Rate (%)</label>
                <div className="flex items-center gap-1">
                  {GST_RATES.map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setGstRate(rate)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                        gstRate === rate
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="gstInclusive"
                  checked={isGstInclusive}
                  onChange={(e) => setIsGstInclusive(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <label htmlFor="gstInclusive" className="text-xs text-slate-700 font-medium">
                  Selling Price is GST Inclusive (MRP)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Results Cards */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 uppercase tracking-wider text-xs">
              Profitability Breakdown
            </h3>

            {/* Top Large KPI Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Net Profit Margin
                </span>
                <p className="text-3xl font-black text-emerald-950">
                  {profitMarginPercent.toFixed(1)}%
                </p>
                <p className="text-[10px] text-emerald-700 font-medium">Based on Net Selling Price</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Cost Markup
                </span>
                <p className="text-3xl font-black text-amber-950">
                  {markupPercent.toFixed(1)}%
                </p>
                <p className="text-[10px] text-amber-700 font-medium">Markup over Total Cost</p>
              </div>
            </div>

            {/* Financial Details Table */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Profit Per Unit:</span>
                <span className={`font-black text-sm ${profitPerUnit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {formatINR(profitPerUnit)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Total Revenue ({quantity} units):</span>
                <span className="font-bold text-slate-900">{formatINR(totalRevenue)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Total Landed Costs:</span>
                <span className="font-bold text-slate-700">{formatINR(totalCost)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">GST Tax Collected ({gstRate}%):</span>
                <span className="font-bold text-slate-700">{formatINR(gstAmountPerUnit * quantity)}</span>
              </div>

              <div className="flex justify-between py-3 border-t-2 border-slate-200 text-base font-black text-slate-950">
                <span>Total Net Profit:</span>
                <span className={totalNetProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {formatINR(totalNetProfit)}
                </span>
              </div>
            </div>

            {/* Visual Margin Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-600 font-bold">
                <span>Cost ({totalCostPerUnit > 0 ? ((totalCostPerUnit / (effectiveSellingPrice || 1)) * 100).toFixed(0) : 0}%)</span>
                <span>Margin ({profitMarginPercent > 0 ? profitMarginPercent.toFixed(0) : 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  className="h-full bg-rose-400"
                  style={{ width: `${Math.min(100, Math.max(0, 100 - profitMarginPercent))}%` }}
                />
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${Math.min(100, Math.max(0, profitMarginPercent))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
