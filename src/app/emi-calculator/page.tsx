'use client';

import React, { useState } from 'react';
import { formatINR } from '@/lib/utils';
import { CreditCard, Calculator, PieChart, ShieldCheck, ChevronDown } from 'lucide-react';
import AdBanner from '@/components/layout/AdBanner';

export default function EMICalculatorPage() {
  const [loanAmount, setLoanAmount] = useState<number>(1500000); // 15 Lakhs
  const [interestRate, setInterestRate] = useState<number>(10.5); // 10.5%
  const [tenureYears, setTenureYears] = useState<number>(5); // 5 years
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // EMI Math: E = P * r * (1+r)^n / ((1+r)^n - 1)
  const totalMonths = tenureUnit === 'years' ? tenureYears * 12 : tenureYears;
  const monthlyRate = interestRate / 12 / 100;

  let monthlyEMI = 0;
  let totalRepayment = 0;
  let totalInterest = 0;

  if (loanAmount > 0 && monthlyRate > 0 && totalMonths > 0) {
    monthlyEMI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    totalRepayment = monthlyEMI * totalMonths;
    totalInterest = totalRepayment - loanAmount;
  }

  const principalPercent = totalRepayment > 0 ? (loanAmount / totalRepayment) * 100 : 0;
  const interestPercent = totalRepayment > 0 ? (totalInterest / totalRepayment) * 100 : 0;

  // Generate Year-wise Amortization summary
  const amortizationRows = [];
  let remainingBalance = loanAmount;
  for (let year = 1; year <= Math.ceil(totalMonths / 12); year++) {
    let yearInterest = 0;
    let yearPrincipal = 0;
    for (let m = 1; m <= 12; m++) {
      if (remainingBalance <= 0) break;
      const mInterest = remainingBalance * monthlyRate;
      const mPrincipal = monthlyEMI - mInterest;
      yearInterest += mInterest;
      yearPrincipal += mPrincipal;
      remainingBalance = Math.max(0, remainingBalance - mPrincipal);
    }
    amortizationRows.push({
      year,
      principal: yearPrincipal,
      interest: yearInterest,
      totalPayment: yearPrincipal + yearInterest,
      balance: remainingBalance,
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1">
          <CreditCard className="w-4 h-4" />
          <span>Business & Equipment Loan Planner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Business Loan EMI Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Calculate monthly installments (EMI), total interest outflow, and yearly amortization schedules for MSME business loans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Interactive Sliders */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            {/* Loan Amount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Loan Amount (Principal)</label>
                <span className="text-sm font-black text-cyan-700 font-mono">{formatINR(loanAmount)}</span>
              </div>
              <input
                type="range"
                min={50000}
                max={10000000}
                step={25000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 accent-cyan-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹50,000</span>
                <span>₹50 Lakhs</span>
                <span>₹1 Crore</span>
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Interest Rate (p.a.)</label>
                <span className="text-sm font-black text-cyan-700 font-mono">{interestRate}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={25}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 accent-cyan-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5%</span>
                <span>15%</span>
                <span>25%</span>
              </div>
            </div>

            {/* Loan Tenure Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Loan Duration / Tenure</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-cyan-700 font-mono">
                    {tenureYears} {tenureUnit}
                  </span>
                  <div className="flex rounded-lg border border-slate-200 overflow-hidden text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setTenureUnit('years')}
                      className={`px-2 py-0.5 ${tenureUnit === 'years' ? 'bg-cyan-600 text-white' : 'bg-slate-50'}`}
                    >
                      Yr
                    </button>
                    <button
                      type="button"
                      onClick={() => setTenureUnit('months')}
                      className={`px-2 py-0.5 ${tenureUnit === 'months' ? 'bg-cyan-600 text-white' : 'bg-slate-50'}`}
                    >
                      Mo
                    </button>
                  </div>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={tenureUnit === 'years' ? 15 : 180}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 accent-cyan-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Output KPI Cards */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 uppercase tracking-wider text-xs">
              Repayment Schedule
            </h3>

            {/* Large Monthly EMI Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white text-center space-y-1 shadow-lg shadow-cyan-500/15">
              <span className="text-xs uppercase tracking-wider text-cyan-200 font-bold">
                Monthly Loan Installment (EMI)
              </span>
              <p className="text-3xl sm:text-4xl font-black">{formatINR(monthlyEMI)}</p>
              <p className="text-xs text-cyan-100 font-medium">For {totalMonths} monthly installments</p>
            </div>

            {/* Repayment Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Principal Loan Amount:</span>
                <span className="font-bold text-slate-900 text-sm">{formatINR(loanAmount)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Total Interest Payable:</span>
                <span className="font-bold text-rose-600 text-sm">+{formatINR(totalInterest)}</span>
              </div>

              <div className="flex justify-between py-3 border-t-2 border-slate-200 text-base font-black text-slate-950">
                <span>Total Payment (Principal + Interest):</span>
                <span className="text-cyan-700">{formatINR(totalRepayment)}</span>
              </div>
            </div>

            {/* Visual Ratio Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-600 font-bold">
                <span className="text-cyan-700">Principal: {principalPercent.toFixed(1)}%</span>
                <span className="text-rose-600">Interest: {interestPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                <div className="h-full bg-cyan-600" style={{ width: `${principalPercent}%` }} />
                <div className="h-full bg-rose-500" style={{ width: `${interestPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Amortization Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Yearly Amortization Breakdown Table</h3>
          <button
            type="button"
            onClick={() => setShowSchedule(!showSchedule)}
            className="text-xs font-bold text-cyan-600 hover:underline flex items-center gap-1"
          >
            <span>{showSchedule ? 'Collapse Table' : 'Expand Schedule'}</span>
            <ChevronDown className={`w-4 h-4 transition ${showSchedule ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showSchedule && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3 rounded-l-lg">Year</th>
                  <th className="py-2.5 px-3">Principal (₹)</th>
                  <th className="py-2.5 px-3">Interest (₹)</th>
                  <th className="py-2.5 px-3">Total Payment (₹)</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-right">Ending Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {amortizationRows.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Year {row.year}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{formatINR(row.principal)}</td>
                    <td className="py-2.5 px-3 font-semibold text-rose-600">{formatINR(row.interest)}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{formatINR(row.totalPayment)}</td>
                    <td className="py-2.5 px-3 font-mono text-right text-slate-600">{formatINR(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
