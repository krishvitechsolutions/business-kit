'use client';

import React from 'react';
import { SalarySlip } from '@/lib/types';
import { formatINR, formatDate, numberToWordsIndian } from '@/lib/utils';
import { Landmark, UserCheck, ShieldCheck } from 'lucide-react';

interface SalarySlipTemplateProps {
  slip: SalarySlip;
  id?: string;
}

export default function SalarySlipTemplate({ slip, id = 'salary-slip-document' }: SalarySlipTemplateProps) {
  return (
    <div
      id={id}
      className="print-area w-full max-w-[850px] mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-slate-800 text-xs font-sans transition-all"
      style={{ minHeight: '950px' }}
    >
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-t-2xl border-b-4 border-blue-600">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-blue-400">
              Confidential Payslip / Salary Statement
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{slip.company.businessName}</h1>
            <p className="text-xs text-slate-300 mt-1">{slip.company.address}, {slip.company.city} - {slip.company.pincode}</p>
          </div>

          <div className="text-left sm:text-right space-y-1 bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Pay Period</div>
            <div className="text-xl font-black text-white">{slip.month}</div>
            <div className="text-xs text-slate-300">
              Pay Date: <span className="font-bold text-white">{formatDate(slip.payDate)}</span>
            </div>
            <div className="text-[11px] text-blue-300 font-mono">Slip: {slip.slipNumber}</div>
          </div>
        </div>
      </div>

      {/* Employee Details Grid */}
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Employee Name:</span>
            <p className="font-bold text-slate-900 text-sm">{slip.employeeName}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Employee ID:</span>
            <p className="font-bold text-slate-900 font-mono">{slip.employeeId}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Designation:</span>
            <p className="font-bold text-slate-900">{slip.designation}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Department:</span>
            <p className="font-bold text-slate-900">{slip.department || 'General'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">PAN Number:</span>
            <p className="font-bold text-slate-900 font-mono">{slip.pan || 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Bank A/C No:</span>
            <p className="font-bold text-slate-900 font-mono">{slip.bankAccount || 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Bank & IFSC:</span>
            <p className="font-bold text-slate-900">{slip.bankName} ({slip.ifsc})</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Working / Paid Days:</span>
            <p className="font-bold text-slate-900">{slip.presentDays} / {slip.workingDays} Days</p>
          </div>
        </div>
      </div>

      {/* Earnings and Deductions Table */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-emerald-50 px-4 py-2.5 font-bold text-emerald-950 border-b border-emerald-200 flex justify-between">
              <span>Earnings Component</span>
              <span>Amount (₹)</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs p-2">
              <div className="flex justify-between py-2 px-2">
                <span className="text-slate-700">Basic Salary</span>
                <span className="font-semibold">{formatINR(slip.earnings.basic)}</span>
              </div>
              <div className="flex justify-between py-2 px-2">
                <span className="text-slate-700">House Rent Allowance (HRA)</span>
                <span className="font-semibold">{formatINR(slip.earnings.hra)}</span>
              </div>
              <div className="flex justify-between py-2 px-2">
                <span className="text-slate-700">Conveyance Allowance</span>
                <span className="font-semibold">{formatINR(slip.earnings.conveyance)}</span>
              </div>
              <div className="flex justify-between py-2 px-2">
                <span className="text-slate-700">Medical Allowance</span>
                <span className="font-semibold">{formatINR(slip.earnings.medical)}</span>
              </div>
              <div className="flex justify-between py-2 px-2">
                <span className="text-slate-700">Special Allowance</span>
                <span className="font-semibold">{formatINR(slip.earnings.specialAllowance)}</span>
              </div>
              {slip.earnings.bonus > 0 && (
                <div className="flex justify-between py-2 px-2">
                  <span className="text-slate-700">Bonus / Incentive</span>
                  <span className="font-semibold text-emerald-700">+{formatINR(slip.earnings.bonus)}</span>
                </div>
              )}
              {slip.earnings.overtime > 0 && (
                <div className="flex justify-between py-2 px-2">
                  <span className="text-slate-700">Overtime Payment</span>
                  <span className="font-semibold text-emerald-700">+{formatINR(slip.earnings.overtime)}</span>
                </div>
              )}
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-between font-bold text-slate-900">
              <span>Gross Earnings (A):</span>
              <span className="text-emerald-700">{formatINR(slip.grossSalary)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-rose-50 px-4 py-2.5 font-bold text-rose-950 border-b border-rose-200 flex justify-between">
              <span>Deductions Component</span>
              <span>Amount (₹)</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs p-2">
              <div className="flex justify-between py-2 px-2">
                <span className="text-slate-700">Provident Fund (EPF 12%)</span>
                <span className="font-semibold">{formatINR(slip.deductions.pf)}</span>
              </div>
              <div className="flex justify-between py-2 px-2">
                <span className="text-slate-700">Employee State Insurance (ESIC)</span>
                <span className="font-semibold">{formatINR(slip.deductions.esi)}</span>
              </div>
              <div className="flex justify-between py-2 px-2">
                <span className="text-slate-700">Professional Tax (PT)</span>
                <span className="font-semibold">{formatINR(slip.deductions.professionalTax)}</span>
              </div>
              <div className="flex justify-between py-2 px-2">
                <span className="text-slate-700">Income Tax (TDS)</span>
                <span className="font-semibold">{formatINR(slip.deductions.tds)}</span>
              </div>
              {slip.deductions.loanDeduction > 0 && (
                <div className="flex justify-between py-2 px-2">
                  <span className="text-slate-700">Staff Advance / Loan Recovery</span>
                  <span className="font-semibold text-rose-700">{formatINR(slip.deductions.loanDeduction)}</span>
                </div>
              )}
              {slip.deductions.otherDeductions > 0 && (
                <div className="flex justify-between py-2 px-2">
                  <span className="text-slate-700">Other Deductions</span>
                  <span className="font-semibold text-rose-700">{formatINR(slip.deductions.otherDeductions)}</span>
                </div>
              )}
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-between font-bold text-slate-900">
              <span>Total Deductions (B):</span>
              <span className="text-rose-700">-{formatINR(slip.totalDeductions)}</span>
            </div>
          </div>
        </div>

        {/* Net Salary Summary Box */}
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-blue-200 font-bold">
              Net Take-Home Salary (A - B)
            </span>
            <p className="text-xs text-blue-100 mt-0.5">Amount Credited to Bank Account</p>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black">{formatINR(slip.netSalary)}</span>
          </div>
        </div>

        {/* Net Salary In Words */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Net Salary in Words:</span>
          <p className="font-bold text-slate-900 text-xs mt-0.5">{slip.netSalaryInWords}</p>
        </div>

        {/* Signatures */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-6 items-end">
          <div className="text-left space-y-6">
            <p className="text-xs font-bold text-slate-900">Employee Signature</p>
            <div className="pt-6">
              <div className="inline-block border-t border-slate-400 pt-1 px-8 text-[11px] text-slate-500">
                Acknowledged By
              </div>
            </div>
          </div>

          <div className="text-right space-y-6">
            <p className="text-xs font-bold text-slate-900">For {slip.company.businessName}</p>
            <div className="pt-6">
              <div className="inline-block border-t border-slate-400 pt-1 px-8 text-[11px] text-slate-500">
                Authorized Signatory / HR
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
