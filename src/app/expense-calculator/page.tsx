'use client';

import React, { useState, useEffect } from 'react';
import { Expense } from '@/lib/types';
import { storage } from '@/lib/storage';
import { EXPENSE_CATEGORIES } from '@/lib/constants';
import { formatINR, getCurrentDateISO, formatDate } from '@/lib/utils';
import { Calculator, Plus, Trash2, Download, TrendingDown, PieChart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import AdBanner from '@/components/layout/AdBanner';

export default function ExpenseCalculatorPage() {
  const [expenses, setExpenses] = useState<Expense[]>(() => storage.getExpenses());
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Office');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getCurrentDateISO());
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;

  // Category totals
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((item) => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || Number(amount) <= 0) return;

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      userId: 'user-01',
      title,
      category,
      amount: Number(amount),
      date,
      paymentMethod,
      notes,
      createdAt: new Date().toISOString(),
    };

    storage.saveExpense(newExp);
    setExpenses(storage.getExpenses());
    setTitle('');
    setAmount('');
    setNotes('');
    confetti({ particleCount: 30, spread: 40 });
  };

  const handleDeleteExpense = (id: string) => {
    storage.deleteExpense(id);
    setExpenses(storage.getExpenses());
  };

  const handleExportCSV = () => {
    const headers = 'ID,Date,Title,Category,Amount,Payment Method,Notes\n';
    const rows = expenses
      .map(
        (e) =>
          `"${e.id}","${e.date}","${e.title.replace(/"/g, '""')}","${e.category}",${e.amount},"${e.paymentMethod}","${(e.notes || '').replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BizTools-Expenses-${getCurrentDateISO()}.csv`;
    link.click();
    confetti({ particleCount: 40, spread: 50 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            <span>Bookkeeping & Overhead Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Business Expense Calculator & Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track daily operating expenses, salaries, rent, electricity and inventory with interactive visual breakdowns and CSV download.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-500/20 transition shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Expenses (CSV)</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tracked Expenses</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{formatINR(totalExpense)}</p>
          <p className="text-xs text-slate-500">{expenses.length} transaction entries logged</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Expense per Item</span>
          <p className="text-2xl sm:text-3xl font-black text-violet-600">{formatINR(averageExpense)}</p>
          <p className="text-xs text-slate-500">Across {Object.keys(categoryTotals).length} active categories</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Largest Cost Center</span>
          <p className="text-2xl sm:text-3xl font-black text-rose-600">
            {Object.keys(categoryTotals).length > 0
              ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
              : 'None'}
          </p>
          <p className="text-xs text-slate-500">
            {Object.keys(categoryTotals).length > 0
              ? formatINR(Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][1])
              : '₹0.00'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Add New Expense Form */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleAddExpense} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-violet-600" />
              <span>Record New Business Expense</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expense Title / Description *</label>
              <input
                type="text"
                placeholder="e.g. Broadband Internet bill"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold bg-white"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="2500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min={1}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expense Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                >
                  <option value="UPI">UPI (GPay / PhonePe)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Vendor Name</label>
              <input
                type="text"
                placeholder="Optional billing remarks"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs shadow-md shadow-violet-500/25 transition"
            >
              Add Expense Record
            </button>
          </form>

          {/* Visual Category Breakdown Progress Bars */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-violet-600" />
              <span>Category Spending Distribution</span>
            </h3>

            <div className="space-y-3">
              {Object.entries(categoryTotals).map(([cat, val]) => {
                const percent = totalExpense > 0 ? (val / totalExpense) * 100 : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-800">{cat}</span>
                      <span className="font-mono text-slate-600">
                        {formatINR(val)} ({percent.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-600"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Expenses Table */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Logged Expenses History</span>
              <span className="text-xs text-slate-500">{expenses.length} Records</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3 rounded-l-lg">Date</th>
                    <th className="py-2.5 px-3">Title & Category</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                    <th className="py-2.5 px-3 rounded-r-lg text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 text-slate-500 font-mono whitespace-nowrap">{formatDate(exp.date)}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">{exp.title}</p>
                        <span className="inline-block px-1.5 py-0.2 rounded bg-violet-100 text-violet-800 text-[10px] font-bold">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{exp.paymentMethod}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">{formatINR(exp.amount)}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
