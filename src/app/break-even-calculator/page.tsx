'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Calculator,
  PieChart,
  Target,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import confetti from 'canvas-confetti';
import AdBanner from '@/components/layout/AdBanner';

export default function BreakEvenCalculatorPage() {
  // Inputs
  const [fixedCosts, setFixedCosts] = useState<number>(75000); // Rent, salaries, software, electricity
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState<number>(500);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(200); // Raw materials, direct packaging, shipping
  const [targetProfit, setTargetProfit] = useState<number>(50000);
  const [copied, setCopied] = useState(false);

  // Quick Presets
  const presets = [
    { label: 'Retail Shop / Dukan', fixed: 60000, price: 800, variable: 450, profit: 40000 },
    { label: 'Cloud Kitchen / Cafe', fixed: 95000, price: 350, variable: 140, profit: 60000 },
    { label: 'Manufacturing / Job Work', fixed: 180000, price: 1200, variable: 650, profit: 100000 },
    { label: 'SaaS / Digital Agency', fixed: 120000, price: 5000, variable: 800, profit: 150000 },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setFixedCosts(p.fixed);
    setSellingPricePerUnit(p.price);
    setVariableCostPerUnit(p.variable);
    setTargetProfit(p.profit);
  };

  // Calculations
  const contributionMarginPerUnit = Math.max(0, sellingPricePerUnit - variableCostPerUnit);
  const contributionMarginRatio =
    sellingPricePerUnit > 0 ? (contributionMarginPerUnit / sellingPricePerUnit) * 100 : 0;

  const breakEvenUnits =
    contributionMarginPerUnit > 0 ? Math.ceil(fixedCosts / contributionMarginPerUnit) : 0;
  const breakEvenRevenue = breakEvenUnits * sellingPricePerUnit;

  const targetUnits =
    contributionMarginPerUnit > 0
      ? Math.ceil((fixedCosts + targetProfit) / contributionMarginPerUnit)
      : 0;
  const targetRevenue = targetUnits * sellingPricePerUnit;

  const handleCopySummary = () => {
    const text = `📊 Break-Even Analysis (BizTools India)
----------------------------------------
Fixed Costs: ${formatINR(fixedCosts)}
Selling Price: ${formatINR(sellingPricePerUnit)} / unit
Variable Cost: ${formatINR(variableCostPerUnit)} / unit
Contribution Margin: ${formatINR(contributionMarginPerUnit)} (${contributionMarginRatio.toFixed(1)}%)

🎯 Break-Even Point: ${breakEvenUnits.toLocaleString('en-IN')} units
💰 Break-Even Sales: ${formatINR(breakEvenRevenue)}
🚀 For ${formatINR(targetProfit)} Profit: Sell ${targetUnits.toLocaleString('en-IN')} units (${formatINR(targetRevenue)})

Calculated free at https://biztools.in/break-even-calculator`;

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
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Target className="w-4 h-4" />
            <span>Financial Planning & Profitability</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Break-Even Point & Target Profit Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Find out exactly how many units or sales revenue you must generate each month to cover fixed expenses and hit your profit goals.
          </p>
        </div>

        <button
          onClick={handleCopySummary}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 shadow-xs transition self-start md:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-amber-700" />}
          <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
        </button>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Load Preset:</span>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 text-xs font-semibold whitespace-nowrap shadow-2xs transition"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-600" />
              <span>Cost & Pricing Parameters</span>
            </h2>

            {/* Fixed Costs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>Total Monthly Fixed Costs (₹)</span>
                  <span className="group relative cursor-pointer text-slate-400 hover:text-slate-600">
                    <Info className="w-3.5 h-3.5" />
                    <span className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-52 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-20">
                      Costs that don&apos;t change with volume: Shop Rent, Staff Salaries, Electricity, Internet, Software, Loan EMIs.
                    </span>
                  </span>
                </label>
                <span className="text-sm font-black text-slate-900">{formatINR(fixedCosts)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  value={fixedCosts}
                  onChange={(e) => setFixedCosts(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Unit Economics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Selling Price */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>Selling Price per Unit (₹)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={sellingPricePerUnit}
                    onChange={(e) => setSellingPricePerUnit(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Average price charged to customer per item/service.</p>
              </div>

              {/* Variable Cost */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>Variable Cost per Unit (₹)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={variableCostPerUnit}
                    onChange={(e) => setVariableCostPerUnit(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Raw materials, packaging, direct freight, merchant fees.</p>
              </div>
            </div>

            {/* Target Monthly Profit */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>Desired Monthly Net Profit (₹)</span>
                </label>
                <span className="text-sm font-black text-emerald-700">{formatINR(targetProfit)}</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  value={targetProfit}
                  onChange={(e) => setTargetProfit(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-emerald-50/40 border-emerald-200"
                />
              </div>
            </div>
          </div>

          {/* Unit Economics Breakdown Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Unit Economics Insight</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                <span className="text-slate-400 text-[11px] block">Contribution Margin</span>
                <span className="text-lg font-black text-white">{formatINR(contributionMarginPerUnit)}</span>
                <span className="text-[10px] text-slate-400 block">per unit sold</span>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                <span className="text-slate-400 text-[11px] block">Margin Ratio (PV)</span>
                <span className="text-lg font-black text-amber-300">{contributionMarginRatio.toFixed(1)}%</span>
                <span className="text-[10px] text-slate-400 block">of selling price</span>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 col-span-2 sm:col-span-1">
                <span className="text-slate-400 text-[11px] block">Cost Structure</span>
                <span className="text-xs font-bold text-slate-200">
                  {sellingPricePerUnit > 0
                    ? `${((variableCostPerUnit / sellingPricePerUnit) * 100).toFixed(0)}% Variable`
                    : '0%'}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {sellingPricePerUnit > 0
                    ? `${(100 - (variableCostPerUnit / sellingPricePerUnit) * 100).toFixed(0)}% Margin`
                    : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Results Card */}
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-100 bg-amber-800/50 px-2.5 py-1 rounded-full">
                Zero Profit / Zero Loss
              </span>
              <h3 className="text-lg font-bold text-white mt-3">Monthly Break-Even Point</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-900/40 p-4 rounded-2xl border border-amber-300/30 backdrop-blur-xs">
                <p className="text-xs text-amber-100">Units Required to Break Even</p>
                <p className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                  {breakEvenUnits.toLocaleString('en-IN')}{' '}
                  <span className="text-sm font-semibold text-amber-200">Units / Month</span>
                </p>
                <p className="text-[11px] text-amber-200 mt-1">
                  ≈ {Math.ceil(breakEvenUnits / 30)} units per day (30 days/month)
                </p>
              </div>

              <div className="bg-amber-900/40 p-4 rounded-2xl border border-amber-300/30 backdrop-blur-xs">
                <p className="text-xs text-amber-100">Monthly Break-Even Sales Revenue</p>
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                  {formatINR(breakEvenRevenue)}
                </p>
                <p className="text-[11px] text-amber-200 mt-1">
                  Minimum monthly billing to avoid business operating losses.
                </p>
              </div>
            </div>

            {/* Target Profit Section */}
            <div className="pt-4 border-t border-amber-400/40 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-100">To Earn {formatINR(targetProfit)} Profit:</span>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-amber-100">Sales Volume:</span>
                  <span className="text-lg font-black text-white">{targetUnits.toLocaleString('en-IN')} units</span>
                </div>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-xs text-amber-100">Total Turnover:</span>
                  <span className="text-lg font-black text-emerald-300">{formatINR(targetRevenue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Related Business Tools</h4>
            <div className="space-y-2">
              <Link
                href="/profit-margin-calculator"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-bold text-slate-800 hover:text-blue-700 transition"
              >
                <span>Profit Margin & Markup Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/expense-calculator"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-bold text-slate-800 hover:text-blue-700 transition"
              >
                <span>Business Expense Tracker</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Guide */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900">How to Use Break-Even Analysis to Grow Your Business</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">1. Lower Your Fixed Costs</h4>
            <p>
              Re-negotiate store rent, cut unused software subscriptions, or share warehouse space. Every ₹10,000 cut in fixed expenses directly reduces your daily sales target.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">2. Increase Contribution Margin</h4>
            <p>
              Buy raw materials in bulk for better vendor discounts or slightly adjust selling price. Increasing your unit margin by even 5% rapidly accelerates reaching profitability.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">3. Set Daily Milestones</h4>
            <p>
              Divide monthly break-even units by 26 or 30 working days. Share this daily threshold with your retail sales staff or marketing team to ensure monthly targets are met.
            </p>
          </div>
        </div>
      </div>

      <AdBanner slot="content-bottom" />
    </div>
  );
}
