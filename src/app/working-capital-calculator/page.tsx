'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Coins,
  Calculator,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Info,
  Layers,
  Activity,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import confetti from 'canvas-confetti';
import AdBanner from '@/components/layout/AdBanner';

export default function WorkingCapitalCalculatorPage() {
  // Current Assets
  const [cashAndBank, setCashAndBank] = useState<number>(250000);
  const [accountsReceivable, setAccountsReceivable] = useState<number>(600000); // Debtors
  const [inventoryValue, setInventoryValue] = useState<number>(450000); // Stock on hand
  const [otherCurrentAssets, setOtherCurrentAssets] = useState<number>(100000); // Advance to suppliers

  // Current Liabilities
  const [accountsPayable, setAccountsPayable] = useState<number>(380000); // Creditors
  const [shortTermLoans, setShortTermLoans] = useState<number>(150000); // CC / OD / Working capital limit used
  const [outstandingExpenses, setOutstandingExpenses] = useState<number>(120000); // Pending GST, Salaries, Rent

  // Operational Cycle Metrics
  const [annualRevenue, setAnnualRevenue] = useState<number>(4800000);
  const [annualCOGS, setAnnualCOGS] = useState<number>(3200000);

  const [copied, setCopied] = useState(false);

  // Calculations
  const totalCurrentAssets = cashAndBank + accountsReceivable + inventoryValue + otherCurrentAssets;
  const totalCurrentLiabilities = accountsPayable + shortTermLoans + outstandingExpenses;
  const netWorkingCapital = totalCurrentAssets - totalCurrentLiabilities;

  // Ratios
  const currentRatio = totalCurrentLiabilities > 0 ? totalCurrentAssets / totalCurrentLiabilities : 0;
  // Quick Assets = Cash + Receivables (excludes inventory and prepaid)
  const quickAssets = cashAndBank + accountsReceivable;
  const quickRatio = totalCurrentLiabilities > 0 ? quickAssets / totalCurrentLiabilities : 0;

  // Operating Cycle (Days)
  // DSO = (Receivables / Annual Revenue) * 365
  const dso = annualRevenue > 0 ? Math.round((accountsReceivable / annualRevenue) * 365) : 0;
  // DIO = (Inventory / Annual COGS) * 365
  const dio = annualCOGS > 0 ? Math.round((inventoryValue / annualCOGS) * 365) : 0;
  // DPO = (Payables / Annual COGS) * 365
  const dpo = annualCOGS > 0 ? Math.round((accountsPayable / annualCOGS) * 365) : 0;
  // Cash Conversion Cycle (CCC) = DIO + DSO - DPO
  const cashConversionCycle = dio + dso - dpo;

  // Health Assessment
  let healthStatus = 'Healthy';
  let healthColor = 'text-emerald-400';
  let healthBg = 'bg-emerald-950/70 border-emerald-500/40';
  let healthTip = 'Your working capital buffer is strong. You can comfortably service short-term debts and take advantage of bulk supplier cash discounts.';

  if (currentRatio < 1.0) {
    healthStatus = 'Critical Liquidity Risk';
    healthColor = 'text-rose-400';
    healthBg = 'bg-rose-950/70 border-rose-500/40';
    healthTip = 'Current liabilities exceed current assets! You risk defaulting on supplier payments or loan EMIs. Focus urgently on recovering pending receivables (debtors) or negotiating extended payment terms with vendors.';
  } else if (currentRatio < 1.33) {
    healthStatus = 'Tight Liquidity';
    healthColor = 'text-amber-400';
    healthBg = 'bg-amber-950/70 border-amber-500/40';
    healthTip = 'Your current ratio is below the standard Indian banking benchmark of 1.33. Indian banks usually require at least 1.33 Current Ratio for sanctioning Cash Credit (CC) / OD limits.';
  }

  const handleCopySummary = () => {
    const text = `📊 Working Capital & Liquidity Assessment (BizTools India)
--------------------------------------------------
Total Current Assets: ${formatINR(totalCurrentAssets)}
  - Cash & Bank: ${formatINR(cashAndBank)}
  - Receivables (Debtors): ${formatINR(accountsReceivable)}
  - Inventory (Stock): ${formatINR(inventoryValue)}
  - Other Advances: ${formatINR(otherCurrentAssets)}

Total Current Liabilities: ${formatINR(totalCurrentLiabilities)}
  - Payables (Creditors): ${formatINR(accountsPayable)}
  - Short-Term Borrowing: ${formatINR(shortTermLoans)}
  - Outstanding Dues: ${formatINR(outstandingExpenses)}

💰 Net Working Capital: ${formatINR(netWorkingCapital)}
📈 Current Ratio: ${currentRatio.toFixed(2)}:1 (Ideal: 1.33 - 2.0)
⚡ Quick / Acid-Test Ratio: ${quickRatio.toFixed(2)}:1 (Ideal: > 1.0)
⏱️ Operating Cash Cycle: ${cashConversionCycle} days (DSO: ${dso}d, DIO: ${dio}d, DPO: ${dpo}d)
🏥 Liquidity Status: ${healthStatus}

Calculated free at https://biztools.in/working-capital-calculator`;

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
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Cash Flow & Working Capital Health</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            MSME Working Capital & Operating Cycle Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Measure liquidity, Current Ratio (bank loan benchmark 1.33), Quick Ratio, and Days Sales Outstanding (DSO) for your business.
          </p>
        </div>

        <button
          onClick={handleCopySummary}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs border border-teal-200 shadow-xs transition self-start md:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-teal-700" />}
          <span>{copied ? 'Copied Analysis!' : 'Copy Analysis'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Current Assets */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-teal-600" />
                <span>Current Assets (Short-Term Liquidity)</span>
              </span>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                Total: {formatINR(totalCurrentAssets)}
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cash & Bank Balances (₹)</label>
                <input
                  type="number"
                  value={cashAndBank}
                  onChange={(e) => setCashAndBank(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Accounts Receivable / Debtors (₹)</label>
                <input
                  type="number"
                  value={accountsReceivable}
                  onChange={(e) => setAccountsReceivable(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inventory / Stock on Hand (₹)</label>
                <input
                  type="number"
                  value={inventoryValue}
                  onChange={(e) => setInventoryValue(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Other Current Assets & Advances (₹)</label>
                <input
                  type="number"
                  value={otherCurrentAssets}
                  onChange={(e) => setOtherCurrentAssets(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Current Liabilities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-rose-600" />
                <span>Current Liabilities (Short-Term Dues)</span>
              </span>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                Total: {formatINR(totalCurrentLiabilities)}
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Accounts Payable / Creditors (₹)</label>
                <input
                  type="number"
                  value={accountsPayable}
                  onChange={(e) => setAccountsPayable(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short-Term Debt / CC limit used (₹)</label>
                <input
                  type="number"
                  value={shortTermLoans}
                  onChange={(e) => setShortTermLoans(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Outstanding GST / Salaries / Dues (₹)</label>
                <input
                  type="number"
                  value={outstandingExpenses}
                  onChange={(e) => setOutstandingExpenses(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Annual Turnover for Operating Cycle */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Cash Conversion Cycle Parameters</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Annual Sales Revenue (₹)</label>
                <input
                  type="number"
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs font-bold text-white bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Annual Cost of Goods Sold / COGS (₹)</label>
                <input
                  type="number"
                  value={annualCOGS}
                  onChange={(e) => setAnnualCOGS(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs font-bold text-white bg-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-200 bg-teal-900/60 px-2.5 py-1 rounded-full">
                Liquidity Health
              </span>
              <h3 className="text-lg font-bold text-white mt-3">Net Working Capital</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-xs">
                <p className="text-xs text-teal-200">Net Working Capital Buffer</p>
                <p className={`text-3xl sm:text-4xl font-black tracking-tight mt-1 ${netWorkingCapital >= 0 ? 'text-white' : 'text-rose-300'}`}>
                  {formatINR(netWorkingCapital)}
                </p>
                <p className="text-[11px] text-teal-200 mt-1">
                  Surplus funds available to finance daily operations without emergency loans.
                </p>
              </div>

              {/* Ratios Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
                  <span className="text-teal-200 text-[11px] block">Current Ratio</span>
                  <span className="text-2xl font-black text-white">{currentRatio.toFixed(2)}</span>
                  <span className="text-[10px] text-teal-300 block">Bank Ideal: &gt; 1.33</span>
                </div>

                <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
                  <span className="text-teal-200 text-[11px] block">Quick / Acid-Test</span>
                  <span className="text-2xl font-black text-white">{quickRatio.toFixed(2)}</span>
                  <span className="text-[10px] text-teal-300 block">Ideal: &gt; 1.00</span>
                </div>
              </div>

              {/* Operating Cycle */}
              <div className="bg-teal-950/70 p-4 rounded-2xl border border-teal-400/30 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-teal-200">Cash Conversion Cycle:</span>
                  <span className="text-xl font-black text-amber-300">{cashConversionCycle} Days</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-teal-300 pt-2 border-t border-teal-800">
                  <div>
                    <span className="block opacity-80">Debtor Days (DSO):</span>
                    <strong className="text-white text-xs">{dso} days</strong>
                  </div>
                  <div>
                    <span className="block opacity-80">Stock Days (DIO):</span>
                    <strong className="text-white text-xs">{dio} days</strong>
                  </div>
                  <div>
                    <span className="block opacity-80">Creditor Days (DPO):</span>
                    <strong className="text-white text-xs">{dpo} days</strong>
                  </div>
                </div>
              </div>

              {/* Status Alert */}
              <div className={`p-4 rounded-2xl border ${healthBg} space-y-1`}>
                <div className="flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${healthColor}`} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${healthColor}`}>
                    {healthStatus}
                  </span>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">{healthTip}</p>
              </div>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Fast-Track Receivables</h4>
            <div className="space-y-2">
              <Link
                href="/whatsapp-payment-reminder"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-bold text-slate-800 hover:text-blue-700 transition"
              >
                <span>Send WhatsApp Payment Reminders</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/upi-qr-generator"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-bold text-slate-800 hover:text-blue-700 transition"
              >
                <span>Generate Instant UPI QR for Faster Collections</span>
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
