'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { SalarySlip } from '@/lib/types';
import { storage } from '@/lib/storage';
import { formatINR, getCurrentDateISO, numberToWordsIndian } from '@/lib/utils';
import SalarySlipTemplate from '@/components/documents/SalarySlipTemplate';
import DocumentActionBar from '@/components/documents/DocumentActionBar';
import { CreditCard, User, Building2, Calculator, Eye, Sparkles } from 'lucide-react';

export default function SalarySlipGeneratorPage() {
  const { businessProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const [slip, setSlip] = useState<SalarySlip>({
    id: `sal-${Date.now()}`,
    userId: 'user-01',
    slipNumber: `PAY-${new Date().getFullYear()}-09-042`,
    month: 'September 2026',
    payDate: getCurrentDateISO(),
    company: businessProfile,
    employeeName: 'Ananya Verma',
    employeeId: 'EMP-104',
    designation: 'Senior Software Engineer',
    department: 'Product Engineering',
    joiningDate: '2024-03-15',
    pan: 'BNQPV9876K',
    bankAccount: '91802004567890',
    bankName: 'ICICI Bank',
    ifsc: 'ICIC0000042',
    uanNumber: '100987654321',
    workingDays: 30,
    presentDays: 30,
    earnings: {
      basic: 45000,
      hra: 22500,
      conveyance: 3000,
      medical: 2500,
      specialAllowance: 12000,
      bonus: 5000,
      overtime: 0,
    },
    deductions: {
      pf: 5400,
      esi: 0,
      professionalTax: 200,
      tds: 4200,
      loanDeduction: 0,
      otherDeductions: 0,
    },
    grossSalary: 90000,
    totalDeductions: 9800,
    netSalary: 80200,
    netSalaryInWords: numberToWordsIndian(80200),
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    setSlip((prev) => ({ ...prev, company: businessProfile }));
  }, [businessProfile]);

  // Recalculate Earnings, Deductions & Net Pay
  useEffect(() => {
    const e = slip.earnings;
    const gross =
      Number(e.basic || 0) +
      Number(e.hra || 0) +
      Number(e.conveyance || 0) +
      Number(e.medical || 0) +
      Number(e.specialAllowance || 0) +
      Number(e.bonus || 0) +
      Number(e.overtime || 0);

    const d = slip.deductions;
    const totalDed =
      Number(d.pf || 0) +
      Number(d.esi || 0) +
      Number(d.professionalTax || 0) +
      Number(d.tds || 0) +
      Number(d.loanDeduction || 0) +
      Number(d.otherDeductions || 0);

    const net = Math.max(0, gross - totalDed);

    setSlip((prev) => ({
      ...prev,
      grossSalary: gross,
      totalDeductions: totalDed,
      netSalary: net,
      netSalaryInWords: numberToWordsIndian(net),
    }));
  }, [JSON.stringify(slip.earnings), JSON.stringify(slip.deductions)]);

  const handleEarningChange = (field: keyof SalarySlip['earnings'], val: number) => {
    setSlip((prev) => ({
      ...prev,
      earnings: { ...prev.earnings, [field]: val },
    }));
  };

  const handleDeductionChange = (field: keyof SalarySlip['deductions'], val: number) => {
    setSlip((prev) => ({
      ...prev,
      deductions: { ...prev.deductions, [field]: val },
    }));
  };

  const handleSave = () => {
    storage.saveSalarySlip(slip);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            <span>Payroll & HR Documents</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Salary Slip / Payslip Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Generate formal payslips for your employees with EPF, ESI, Professional Tax (PT), TDS and bank credits.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl shrink-0 no-print">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Edit Payroll
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'preview' ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>2. Preview Payslip</span>
          </button>
        </div>
      </div>

      <DocumentActionBar
        documentId={slip.slipNumber}
        documentTitle={`SalarySlip-${slip.employeeName}-${slip.month}`}
        targetElementId="salary-slip-document"
        onSave={handleSave}
      />

      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Employee Details */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-sky-600" />
                <span>Employee & Pay Period Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employee Name *</label>
                  <input
                    type="text"
                    value={slip.employeeName}
                    onChange={(e) => setSlip({ ...slip, employeeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    value={slip.employeeId}
                    onChange={(e) => setSlip({ ...slip, employeeId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={slip.designation}
                    onChange={(e) => setSlip({ ...slip, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pay Month (e.g. Oct 2026) *</label>
                  <input
                    type="text"
                    value={slip.month}
                    onChange={(e) => setSlip({ ...slip, month: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PAN Number</label>
                  <input
                    type="text"
                    value={slip.pan}
                    onChange={(e) => setSlip({ ...slip, pan: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bank Account No</label>
                  <input
                    type="text"
                    value={slip.bankAccount}
                    onChange={(e) => setSlip({ ...slip, bankAccount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Earnings Inputs */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-emerald-950 text-sm pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Monthly Earnings Breakdown</span>
                <span className="text-emerald-700 font-black text-sm">Total: {formatINR(slip.grossSalary)}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Basic Salary (₹) *</label>
                  <input
                    type="number"
                    value={slip.earnings.basic}
                    onChange={(e) => handleEarningChange('basic', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">HRA (₹)</label>
                  <input
                    type="number"
                    value={slip.earnings.hra}
                    onChange={(e) => handleEarningChange('hra', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Special Allowance (₹)</label>
                  <input
                    type="number"
                    value={slip.earnings.specialAllowance}
                    onChange={(e) => handleEarningChange('specialAllowance', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Conveyance Allowance (₹)</label>
                  <input
                    type="number"
                    value={slip.earnings.conveyance}
                    onChange={(e) => handleEarningChange('conveyance', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Medical Allowance (₹)</label>
                  <input
                    type="number"
                    value={slip.earnings.medical}
                    onChange={(e) => handleEarningChange('medical', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bonus / Incentive (₹)</label>
                  <input
                    type="number"
                    value={slip.earnings.bonus}
                    onChange={(e) => handleEarningChange('bonus', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Deductions Inputs */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-rose-950 text-sm pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Statutory & Other Deductions</span>
                <span className="text-rose-700 font-black text-sm">Total: -{formatINR(slip.totalDeductions)}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Provident Fund EPF (₹)</label>
                  <input
                    type="number"
                    value={slip.deductions.pf}
                    onChange={(e) => handleDeductionChange('pf', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Professional Tax PT (₹)</label>
                  <input
                    type="number"
                    value={slip.deductions.professionalTax}
                    onChange={(e) => handleDeductionChange('professionalTax', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Income Tax TDS (₹)</label>
                  <input
                    type="number"
                    value={slip.deductions.tds}
                    onChange={(e) => handleDeductionChange('tds', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ESIC (₹)</label>
                  <input
                    type="number"
                    value={slip.deductions.esi}
                    onChange={(e) => handleDeductionChange('esi', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loan / Advance Recovery (₹)</label>
                  <input
                    type="number"
                    value={slip.deductions.loanDeduction}
                    onChange={(e) => handleDeductionChange('loanDeduction', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 sticky top-24">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                Net Pay Summary
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Earnings (A):</span>
                  <span className="font-bold text-emerald-700">{formatINR(slip.grossSalary)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Deductions (B):</span>
                  <span className="font-bold text-rose-700">-{formatINR(slip.totalDeductions)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200 text-base font-black text-slate-950">
                  <span>Net Salary (A - B):</span>
                  <span className="text-sky-600">{formatINR(slip.netSalary)}</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[11px] text-slate-800">
                  <span className="font-bold text-amber-900 uppercase text-[10px]">Net in Words:</span>
                  <p className="mt-0.5 font-semibold leading-tight">{slip.netSalaryInWords}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 transition"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Salary Slip PDF</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <SalarySlipTemplate slip={slip} id="salary-slip-document" />
        </div>
      )}
    </div>
  );
}
