'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Calculator,
  User,
  ShieldCheck,
  TrendingUp,
  Percent,
  Copy,
  Check,
  ArrowRight,
  Info,
  Building2,
  Sparkles,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import confetti from 'canvas-confetti';
import AdBanner from '@/components/layout/AdBanner';

export default function SalaryCalculatorPage() {
  const [annualCtc, setAnnualCtc] = useState<number>(900000); // 9 Lakhs CTC
  const [basicSalaryPercent, setBasicSalaryPercent] = useState<number>(50); // 50% of CTC
  const [hraPercent, setHraPercent] = useState<number>(40); // 40% of Basic (Non-Metro) or 50% (Metro)
  const [epfCapped, setEpfCapped] = useState<boolean>(true); // Capped at ₹1,800/mo (12% of ₹15,000) or actual 12%
  const [statePt, setStatePt] = useState<string>('karnataka'); // Professional Tax: Karnataka ₹200, Maharashtra ₹200, etc.
  const [taxRegime, setTaxRegime] = useState<'new' | 'old'>('new');
  const [includeGratuity, setIncludeGratuity] = useState<boolean>(true); // 4.81% of Basic

  const [copied, setCopied] = useState(false);

  // Quick CTC Presets
  const presets = [
    { label: '₹3.6 LPA (Fresher)', ctc: 360000 },
    { label: '₹6 LPA (Junior)', ctc: 600000 },
    { label: '₹9 LPA (Mid-Level)', ctc: 900000 },
    { label: '₹15 LPA (Senior)', ctc: 1500000 },
    { label: '₹24 LPA (Lead / Mgr)', ctc: 2400000 },
  ];

  // Calculations
  const monthlyCtc = annualCtc / 12;

  // Basic Pay
  const monthlyBasic = (monthlyCtc * basicSalaryPercent) / 100;
  const annualBasic = monthlyBasic * 12;

  // HRA
  const monthlyHra = (monthlyBasic * hraPercent) / 100;

  // EPF (Employee Contribution 12% + Employer Contribution 12%)
  const epfWages = epfCapped ? Math.min(15000, monthlyBasic) : monthlyBasic;
  const monthlyEmployeeEpf = Math.round(epfWages * 0.12);
  const monthlyEmployerEpf = Math.round(epfWages * 0.12);

  // Gratuity (Employer Contribution ~4.81% of Basic in CTC)
  const monthlyGratuity = includeGratuity ? Math.round((monthlyBasic * 15) / 26 / 12) : 0;

  // Professional Tax (Monthly)
  const getMonthlyPt = (state: string, wage: number): number => {
    if (wage < 15000) return 0;
    switch (state) {
      case 'karnataka':
        return wage >= 15000 ? 200 : 0;
      case 'maharashtra':
        return 200; // ₹300 in Feb, ₹200 other months, avg 208
      case 'west_bengal':
        return 200;
      case 'telangana':
      case 'andhra_pradesh':
        return 200;
      case 'tamil_nadu':
        return 208;
      case 'delhi':
      case 'haryana':
      case 'rajasthan':
        return 0; // No PT in Delhi/Haryana
      default:
        return 200;
    }
  };

  const monthlyPt = getMonthlyPt(statePt, monthlyCtc);

  // Special Allowance / Balancing Allowance in CTC
  // CTC = Basic + HRA + Special Allowance + Employer EPF + Gratuity
  const monthlySpecialAllowance = Math.max(
    0,
    monthlyCtc - (monthlyBasic + monthlyHra + monthlyEmployerEpf + monthlyGratuity)
  );

  // Gross Monthly Salary (Basic + HRA + Special Allowance)
  const monthlyGrossSalary = monthlyBasic + monthlyHra + monthlySpecialAllowance;
  const annualGrossSalary = monthlyGrossSalary * 12;

  // Income Tax Calculation (FY 2024-25 / 2025-26 New Tax Regime)
  // Standard Deduction under New Regime: ₹75,000 (Finance Act 2024)
  const calculateAnnualTaxNewRegime = (gross: number): number => {
    const taxableIncome = Math.max(0, gross - 75000);
    if (taxableIncome <= 700000) return 0; // Section 87A rebate makes it ₹0 tax up to ₹7.75 Lakh gross!

    let tax = 0;
    // 0 - 3L: Nil
    // 3L - 7L (4L @ 5%): 20,000
    if (taxableIncome > 300000) {
      tax += Math.min(400000, taxableIncome - 300000) * 0.05;
    }
    // 7L - 10L (3L @ 10%): 30,000
    if (taxableIncome > 700000) {
      tax += Math.min(300000, taxableIncome - 700000) * 0.1;
    }
    // 10L - 12L (2L @ 15%): 30,000
    if (taxableIncome > 1000000) {
      tax += Math.min(200000, taxableIncome - 1000000) * 0.15;
    }
    // 12L - 15L (3L @ 20%): 60,000
    if (taxableIncome > 1200000) {
      tax += Math.min(300000, taxableIncome - 1200000) * 0.2;
    }
    // Above 15L @ 30%
    if (taxableIncome > 1500000) {
      tax += (taxableIncome - 1500000) * 0.3;
    }

    // Health & Education Cess @ 4%
    const cess = tax * 0.04;
    return Math.round(tax + cess);
  };

  const annualIncomeTax = taxRegime === 'new' ? calculateAnnualTaxNewRegime(annualGrossSalary) : calculateAnnualTaxNewRegime(annualGrossSalary);
  const monthlyTds = Math.round(annualIncomeTax / 12);

  // Total Employee Deductions = Employee EPF + PT + TDS
  const monthlyTotalDeductions = monthlyEmployeeEpf + monthlyPt + monthlyTds;

  // Take-Home In-Hand Salary
  const monthlyInHand = Math.max(0, monthlyGrossSalary - monthlyTotalDeductions);
  const annualInHand = monthlyInHand * 12;

  const handleCopySummary = () => {
    const text = `💰 CTC to In-Hand Salary Breakdown (BizTools India)
--------------------------------------------------
Annual CTC: ${formatINR(annualCtc)} (₹${(annualCtc / 100000).toFixed(1)} LPA)
Monthly Gross Salary: ${formatINR(monthlyGrossSalary)}

📋 Monthly Earnings:
  - Basic Salary: ${formatINR(monthlyBasic)}
  - HRA: ${formatINR(monthlyHra)}
  - Special Allowance: ${formatINR(monthlySpecialAllowance)}

📉 Monthly Deductions:
  - Employee EPF (12%): ${formatINR(monthlyEmployeeEpf)}
  - Professional Tax (PT): ${formatINR(monthlyPt)}
  - Estimated Income Tax TDS: ${formatINR(monthlyTds)}
  Total Deductions: ${formatINR(monthlyTotalDeductions)}

💵 NET MONTHLY IN-HAND SALARY: ${formatINR(monthlyInHand)}
🏦 Net Annual Take-Home: ${formatINR(annualInHand)}

Calculated free at https://biztools.in/salary-calculator`;

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
          <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            <span>HR, Payroll & Tax Deductions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            CTC to In-Hand Salary Calculator (FY 2025-26)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Convert your Annual Cost to Company (CTC) into exact monthly take-home salary after EPF, Professional Tax (PT), Gratuity, and Income Tax.
          </p>
        </div>

        <button
          onClick={handleCopySummary}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs border border-sky-200 shadow-xs transition self-start md:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-sky-700" />}
          <span>{copied ? 'Copied Payslip!' : 'Copy Breakdown'}</span>
        </button>
      </div>

      {/* Quick CTC Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Quick CTC:</span>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => setAnnualCtc(p.ctc)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 text-xs font-semibold whitespace-nowrap shadow-2xs transition"
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
              <Calculator className="w-5 h-5 text-sky-600" />
              <span>CTC & Compensation Package</span>
            </h2>

            {/* Annual CTC */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">Annual CTC (Cost to Company) (₹)</label>
                <span className="text-base font-black text-sky-700">{formatINR(annualCtc)}</span>
              </div>
              <input
                type="range"
                min="200000"
                max="5000000"
                step="50000"
                value={annualCtc}
                onChange={(e) => setAnnualCtc(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  value={annualCtc}
                  onChange={(e) => setAnnualCtc(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Salary Structure Tuning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Basic Salary (% of CTC)</label>
                <select
                  value={basicSalaryPercent}
                  onChange={(e) => setBasicSalaryPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value={50}>50% (Standard Corporate/Labor Code)</option>
                  <option value={40}>40% (Higher Take-Home)</option>
                  <option value={35}>35% (Startup / Flexible)</option>
                  <option value={60}>60% (High Retirement Savings)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State for Professional Tax (PT)</label>
                <select
                  value={statePt}
                  onChange={(e) => setStatePt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="karnataka">Karnataka (₹200/mo)</option>
                  <option value="maharashtra">Maharashtra (₹200/mo)</option>
                  <option value="tamil_nadu">Tamil Nadu (₹208/mo)</option>
                  <option value="telangana">Telangana / AP (₹200/mo)</option>
                  <option value="west_bengal">West Bengal (₹200/mo)</option>
                  <option value="delhi">Delhi / NCR (₹0 PT)</option>
                  <option value="haryana">Haryana / Gurgaon (₹0 PT)</option>
                </select>
              </div>
            </div>

            {/* EPF & Gratuity Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Cap EPF to Statutory ₹1,800/month?</span>
                  <span className="text-[11px] text-slate-500">
                    Calculates 12% on ₹15,000 wage ceiling instead of full basic (boosts monthly in-hand cash).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEpfCapped(!epfCapped)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    epfCapped ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                      epfCapped ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Include Gratuity in CTC? (~4.81%)</span>
                  <span className="text-[11px] text-slate-500">
                    Statutory gratuity retained by employer for 5+ years service.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeGratuity(!includeGratuity)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    includeGratuity ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                      includeGratuity ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-200 bg-sky-950/60 px-2.5 py-1 rounded-full">
                Take-Home Pay
              </span>
              <h3 className="text-lg font-bold text-white mt-3">Monthly Net In-Hand Salary</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-xs">
                <p className="text-xs text-sky-200">Amount Credited to Your Bank Account</p>
                <p className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                  {formatINR(monthlyInHand)}
                  <span className="text-sm font-semibold text-sky-200"> / mo</span>
                </p>
                <p className="text-[11px] text-sky-200 mt-1">
                  Annual In-Hand: <strong>{formatINR(annualInHand)}</strong> ({( (annualInHand / annualCtc) * 100 ).toFixed(1)}% of CTC)
                </p>
              </div>

              {/* Monthly Breakdown List */}
              <div className="bg-sky-950/70 p-4 rounded-2xl border border-sky-400/30 space-y-2 text-xs">
                <div className="flex justify-between text-sky-200">
                  <span>Gross Monthly Salary:</span>
                  <span className="font-bold text-white">{formatINR(monthlyGrossSalary)}</span>
                </div>
                <div className="pt-2 border-t border-sky-800/80 space-y-1 text-slate-300">
                  <div className="flex justify-between text-[11px]">
                    <span>• Basic Pay:</span>
                    <span>{formatINR(monthlyBasic)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>• HRA Allowance:</span>
                    <span>{formatINR(monthlyHra)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>• Special Allowance:</span>
                    <span>{formatINR(monthlySpecialAllowance)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-sky-800/80 space-y-1 text-rose-300">
                  <div className="flex justify-between text-[11px]">
                    <span>• Less: Employee EPF (12%):</span>
                    <span>- {formatINR(monthlyEmployeeEpf)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>• Less: Professional Tax (PT):</span>
                    <span>- {formatINR(monthlyPt)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>• Less: Income Tax (TDS):</span>
                    <span>- {formatINR(monthlyTds)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/20 flex justify-between font-black text-sm text-white">
                  <span>Net Take-Home Cash:</span>
                  <span className="text-emerald-300">{formatINR(monthlyInHand)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Generate Employee Payslips</h4>
            <div className="space-y-2">
              <Link
                href="/salary-slip-generator"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-bold text-slate-800 hover:text-blue-700 transition"
              >
                <span>Generate Official PDF Salary Slip</span>
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
