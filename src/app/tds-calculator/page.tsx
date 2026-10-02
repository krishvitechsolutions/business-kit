'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Percent,
  Calculator,
  ShieldCheck,
  Building2,
  User,
  Calendar,
  Info,
  Copy,
  Check,
  ArrowRight,
  AlertTriangle,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import confetti from 'canvas-confetti';
import AdBanner from '@/components/layout/AdBanner';

interface TDSSection {
  code: string;
  name: string;
  description: string;
  rateIndividual: number;
  rateCompany: number;
  thresholdLimit: number;
  thresholdNote: string;
  dueDateNote: string;
}

export default function TDSCalculatorPage() {
  const tdsSections: TDSSection[] = [
    {
      code: '194J',
      name: 'Sec 194J - Professional & Technical Fees',
      description: 'Consultancy, Legal, CA, Architecture, Medical, Software & Technical services.',
      rateIndividual: 10,
      rateCompany: 10,
      thresholdLimit: 30000,
      thresholdNote: '₹30,000 per financial year (2% for Call Centre / Tech royalty)',
      dueDateNote: '7th of following month (30th April for March)',
    },
    {
      code: '194C',
      name: 'Sec 194C - Contractor & Subcontractor Payments',
      description: 'Works contract, transportation, advertising, catering, manufacturing job work.',
      rateIndividual: 1,
      rateCompany: 2,
      thresholdLimit: 30000,
      thresholdNote: 'Single bill > ₹30,000 OR aggregate > ₹1,00,000 per financial year',
      dueDateNote: '7th of following month (30th April for March)',
    },
    {
      code: '194I_BUILDING',
      name: 'Sec 194I - Rent on Land, Building or Office',
      description: 'Commercial shop rent, office rent, residential lease by business.',
      rateIndividual: 10,
      rateCompany: 10,
      thresholdLimit: 240000,
      thresholdNote: '₹2,40,000 per financial year',
      dueDateNote: '7th of following month (30th April for March)',
    },
    {
      code: '194I_PLANT',
      name: 'Sec 194I - Rent on Plant, Machinery or Equipment',
      description: 'Leasing generators, CNC machines, vehicles, construction equipment.',
      rateIndividual: 2,
      rateCompany: 2,
      thresholdLimit: 240000,
      thresholdNote: '₹2,40,000 per financial year',
      dueDateNote: '7th of following month (30th April for March)',
    },
    {
      code: '194H',
      name: 'Sec 194H - Commission & Brokerage',
      description: 'Real estate brokerage, sales agent commissions, distributor incentives.',
      rateIndividual: 2,
      rateCompany: 2,
      thresholdLimit: 15000,
      thresholdNote: '₹15,000 per financial year (reduced from 5% in Budget 2024)',
      dueDateNote: '7th of following month (30th April for March)',
    },
    {
      code: '194Q',
      name: 'Sec 194Q - Purchase of Goods > ₹50 Lakhs',
      description: 'TDS on high-value goods purchases when buyer turnover exceeds ₹10 Cr.',
      rateIndividual: 0.1,
      rateCompany: 0.1,
      thresholdLimit: 5000000,
      thresholdNote: 'Amount exceeding ₹50,00,000 in a financial year',
      dueDateNote: '7th of following month (30th April for March)',
    },
    {
      code: '194A',
      name: 'Sec 194A - Interest (Other than Securities)',
      description: 'Loan interest to private parties, NBFC interest, unsecured business loans.',
      rateIndividual: 10,
      rateCompany: 10,
      thresholdLimit: 5000,
      thresholdNote: '₹5,000 for non-banking / ₹40,000 for bank deposits',
      dueDateNote: '7th of following month (30th April for March)',
    },
    {
      code: 'GST_TDS',
      name: 'GST TDS (Sec 51) - Government & PSU Contracts',
      description: 'TDS under CGST/SGST Act deducted by Gov depts on contracts > ₹2.5 Lakhs.',
      rateIndividual: 2,
      rateCompany: 2,
      thresholdLimit: 250000,
      thresholdNote: 'Contract value exceeding ₹2,50,000 (1% CGST + 1% SGST or 2% IGST)',
      dueDateNote: '10th of following month in GSTR-7',
    },
  ];

  const [selectedSectionCode, setSelectedSectionCode] = useState<string>('194J');
  const [deducteeType, setDeducteeType] = useState<'individual' | 'company'>('individual');
  const [hasPan, setHasPan] = useState<boolean>(true);
  const [billAmount, setBillAmount] = useState<number>(100000);
  const [copied, setCopied] = useState(false);

  const currentSection = tdsSections.find((s) => s.code === selectedSectionCode) || tdsSections[0];

  // Base rate
  const baseRate = deducteeType === 'individual' ? currentSection.rateIndividual : currentSection.rateCompany;
  // If PAN is not furnished, Section 206AA mandates minimum 20% TDS
  const applicableRate = hasPan ? baseRate : Math.max(20, baseRate);

  const tdsAmount = Math.round((billAmount * applicableRate) / 100);
  const netPayable = Math.max(0, billAmount - tdsAmount);

  const handleCopySummary = () => {
    const text = `📋 TDS Calculation Summary (BizTools India)
----------------------------------------
Section: ${currentSection.name}
Gross Bill Amount: ${formatINR(billAmount)}
Deductee: ${deducteeType === 'individual' ? 'Individual / Sole Proprietor / HUF' : 'Company / Firm / LLP'}
PAN Status: ${hasPan ? 'PAN Available' : 'NO PAN (Sec 206AA Penal Rate 20%)'}
Applicable TDS Rate: ${applicableRate}%

💰 TDS Amount to Deduct: ${formatINR(tdsAmount)}
💵 Net Amount to Pay Vendor: ${formatINR(netPayable)}
📅 Deposit Due Date: ${currentSection.dueDateNote}

Calculated free at https://biztools.in/tds-calculator`;

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
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Income Tax & GST Statutory Deductions (FY 2025-26)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            TDS & TCS Calculator India
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Calculate statutory Tax Deducted at Source (TDS) for vendor bills, contractor payments, commercial rent, and professional fees.
          </p>
        </div>

        <button
          onClick={handleCopySummary}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200 shadow-xs transition self-start md:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-blue-700" />}
          <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <span>Bill & Payment Details</span>
            </h2>

            {/* Section Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Select TDS Section *</span>
              </label>
              <select
                value={selectedSectionCode}
                onChange={(e) => setSelectedSectionCode(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white shadow-2xs"
              >
                {tdsSections.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.rateIndividual}%)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">{currentSection.description}</p>
            </div>

            {/* Bill Amount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">Gross Invoice / Payment Amount (₹)</label>
                <span className="text-sm font-black text-slate-900">{formatINR(billAmount)}</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Deductee Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">Deductee Status / Entity Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeducteeType('individual')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition ${
                    deducteeType === 'individual'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs block">Individual / Proprietor / HUF</span>
                    <span className="text-[10px] text-slate-500 font-normal">Freelancer, Single Owner, Landlord</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeducteeType('company')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition ${
                    deducteeType === 'company'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs block">Company / Firm / LLP</span>
                    <span className="text-[10px] text-slate-500 font-normal">Pvt Ltd, Partnership, LLP</span>
                  </div>
                </button>
              </div>
            </div>

            {/* PAN Furnished Toggle */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">Has Vendor Furnished Valid PAN?</span>
                <span className="text-[11px] text-slate-500">
                  If PAN is not provided, Section 206AA mandates minimum 20% TDS deduction.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHasPan(!hasPan)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  hasPan ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    hasPan ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {!hasPan && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Higher TDS Rate Applied:</strong> As per Section 206AA of Income Tax Act, TDS is deducted at <strong>20%</strong> because no PAN was provided.
                </div>
              </div>
            )}
          </div>

          {/* Statutory Threshold & Due Dates */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Section Rules & Threshold Limits</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-slate-400 text-[11px] block">Exemption Threshold</span>
                <span className="text-sm font-bold text-white block">{currentSection.thresholdNote}</span>
                <span className="text-[10px] text-slate-400 block">No TDS if below this limit</span>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-slate-400 text-[11px] block">Deposit & Return Due Date</span>
                <span className="text-sm font-bold text-emerald-400 block">{currentSection.dueDateNote}</span>
                <span className="text-[10px] text-slate-400 block">Deposit via Challan ITNS 281</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Results Card */}
          <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-200 bg-blue-800/60 px-2.5 py-1 rounded-full">
                TDS Deduction Summary
              </span>
              <h3 className="text-lg font-bold text-white mt-3">{currentSection.name.split('-')[0]} Calculation</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-xs">
                <div className="flex justify-between items-center text-xs text-blue-200">
                  <span>Applicable TDS Rate:</span>
                  <span className="text-base font-black text-amber-300">{applicableRate}%</span>
                </div>
                <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-xs text-blue-100">TDS Amount to Deduct:</span>
                  <span className="text-2xl sm:text-3xl font-black text-white">{formatINR(tdsAmount)}</span>
                </div>
              </div>

              <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-400/30 backdrop-blur-xs">
                <p className="text-xs text-emerald-300">Net Payable to Vendor / Payee</p>
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-300 mt-1">
                  {formatINR(netPayable)}
                </p>
                <p className="text-[11px] text-emerald-200 mt-1">
                  Amount to transfer via NEFT / RTGS / UPI to vendor bank.
                </p>
              </div>
            </div>

            {/* Step-by-Step Breakdown */}
            <div className="pt-4 border-t border-blue-400/30 space-y-2 text-xs text-blue-100">
              <div className="flex justify-between">
                <span>Gross Invoice Amount:</span>
                <span className="font-bold text-white">{formatINR(billAmount)}</span>
              </div>
              <div className="flex justify-between text-rose-300">
                <span>Less: TDS @ {applicableRate}%:</span>
                <span className="font-bold">- {formatINR(tdsAmount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/20 font-black text-sm text-white">
                <span>Total Net Remittance:</span>
                <span className="text-emerald-300">{formatINR(netPayable)}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Generate Documents</h4>
            <div className="space-y-2">
              <Link
                href="/gst-invoice-generator"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-bold text-slate-800 hover:text-blue-700 transition"
              >
                <span>Create GST Tax Invoice with TDS note</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/receipt-generator"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-bold text-slate-800 hover:text-blue-700 transition"
              >
                <span>Issue Net Payment Receipt</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Guidance */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900">Important TDS Compliance Notes for Indian MSMEs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">Quarterly Returns (Form 26Q)</h4>
            <p>
              TDS deducted must be deposited by the 7th of the following month. File quarterly e-TDS returns in Form 26Q (Q1: July 31, Q2: Oct 31, Q3: Jan 31, Q4: May 31).
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">Form 16A Certificates</h4>
            <p>
              Issue Form 16A TDS certificates downloaded from TRACES to your vendors within 15 days from the due date of filing quarterly TDS returns.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">Interest on Late Deduction/Deposit</h4>
            <p>
              Late deduction attracts 1% per month interest, while late deposit of deducted TDS attracts 1.5% per month interest under Section 201(1A).
            </p>
          </div>
        </div>
      </div>

      <AdBanner slot="content-bottom" />
    </div>
  );
}
