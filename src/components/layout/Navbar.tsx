'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Calculator,
  QrCode,
  FolderOpen,
  CreditCard,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Receipt,
  FileCheck,
  Building2,
  Percent,
  TrendingUp,
  MessageSquare,
  ShieldAlert,
  Crown,
  LogOut,
  ShoppingBag,
  Truck,
  Target,
  ShieldCheck,
  Tag,
  Activity,
  Coins,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, toggleAdminMode } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsDropdownOpen, setDocsDropdownOpen] = useState(false);
  const [calcDropdownOpen, setCalcDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDocsDropdownOpen(false);
    setCalcDropdownOpen(false);
    setToolsDropdownOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const documentTools = [
    { name: 'GST Invoice Maker', href: '/gst-invoice-generator', desc: 'Create compliant GST tax invoices with QR & HSN', icon: FileText, badge: 'Popular' },
    { name: 'Quotation / Estimate', href: '/quotation-maker', desc: 'Send professional price proposals to clients', icon: FileCheck },
    { name: 'Delivery Challan (Rule 55)', href: '/delivery-challan-generator', desc: 'Goods movement for Job Work & Approval', icon: Truck, badge: 'New' },
    { name: 'Purchase Order (PO)', href: '/purchase-order-generator', desc: 'Order goods & services from suppliers', icon: Building2 },
    { name: 'Payment Receipt', href: '/receipt-generator', desc: 'Issue instant receipts for cash, UPI & cards', icon: Receipt },
    { name: 'Salary Slip Maker', href: '/salary-slip-generator', desc: 'Generate payslips with PF, TDS & HRA', icon: CreditCard },
    { name: 'Business Card Maker', href: '/business-card-maker', desc: 'Design printable cards with UPI payment QR', icon: Sparkles },
    { name: 'PDF Invoice Importer', href: '/pdf-invoice', desc: 'Clean A4 layout editor and PDF print tool', icon: FileText },
  ];

  const calculatorTools = [
    { name: 'GST Calculator', href: '/gst-calculator', desc: 'Add or remove GST with 5%, 12%, 18%, 28% slabs', icon: Percent, badge: 'Essential' },
    { name: 'Profit Margin & Markup', href: '/profit-margin-calculator', desc: 'Calculate markup, gross margin & unit profits', icon: TrendingUp },
    { name: 'Break-Even Point (BEP)', href: '/break-even-calculator', desc: 'Calculate units & revenue needed to cover fixed costs', icon: Target, badge: 'High Value' },
    { name: 'TDS & TCS Calculator', href: '/tds-calculator', desc: 'Calculate 194C, 194J, 194I & 194H tax deductions', icon: ShieldCheck, badge: 'Tax Rule' },
    { name: 'Discount & Schemes', href: '/discount-calculator', desc: 'Single, multi-tier (20%+10%), BOGO & cash discount', icon: Tag },
    { name: 'Working Capital Health', href: '/working-capital-calculator', desc: 'Current Ratio, Quick Ratio & Cash Cycle (DSO)', icon: Activity },
    { name: 'CTC to In-Hand Salary', href: '/salary-calculator', desc: 'Monthly take-home after EPF, PT & New Tax Regime', icon: CreditCard },
    { name: 'Business Expense Tracker', href: '/expense-calculator', desc: 'Track operating costs, rent, salaries & software', icon: Calculator },
    { name: 'Business Loan EMI', href: '/emi-calculator', desc: 'Calculate monthly repayment & interest schedules', icon: Coins },
  ];

  const businessTools = [
    { name: 'UPI & Business QR Code', href: '/upi-qr-generator', desc: 'Create payment QR for GPay, PhonePe & Paytm', icon: QrCode, badge: 'Free' },
    { name: 'WhatsApp Payment Message', href: '/whatsapp-payment-reminder', desc: 'Send polite reminders with UPI link on WhatsApp', icon: MessageSquare },
    { name: 'WhatsApp Catalogue Maker', href: '/whatsapp-catalogue', desc: 'Create product catalog with 1-click order button', icon: ShoppingBag },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 text-white px-4 py-1.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wide">
              🇮🇳 Made for India
            </span>
            <span className="hidden sm:inline text-slate-300">
              100% Free GST Invoicing, QR & Calculators for MSMEs, Freelancers & Shopkeepers
            </span>
            <span className="sm:hidden text-slate-300">Free Business Tools for Indian MSMEs</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-amber-300 hover:text-amber-200 font-semibold text-xs flex items-center gap-1">
              <Crown className="w-3 h-3" /> Pro Plans ₹199/mo
            </Link>
            {isAuthenticated && (
              <button
                onClick={toggleAdminMode}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1 transition"
                title="Toggle Admin View"
              >
                <ShieldAlert className="w-3 h-3 text-emerald-400" />
                {user?.role === 'admin' ? 'Admin Active' : 'Test Admin'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  BizTools<span className="text-blue-600">.in</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 animate-pulse" />
              </div>
              <p className="text-[10px] font-semibold text-slate-500 -mt-0.5 tracking-wider uppercase">
                Create • Calculate • Grow
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {/* Documents Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setDocsDropdownOpen(!docsDropdownOpen);
                  setCalcDropdownOpen(false);
                  setToolsDropdownOpen(false);
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition"
              >
                <span>Create Documents</span>
                <ChevronDown className={`w-4 h-4 transition ${docsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {docsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Business Document Makers
                  </div>
                  <div className="space-y-1">
                    {documentTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50/70 transition group"
                        >
                          <div className="p-2 rounded-lg bg-blue-100/70 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">{tool.name}</span>
                              {tool.badge && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{tool.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Calculators Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setCalcDropdownOpen(!calcDropdownOpen);
                  setDocsDropdownOpen(false);
                  setToolsDropdownOpen(false);
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition"
              >
                <span>Calculators</span>
                <ChevronDown className={`w-4 h-4 transition ${calcDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {calcDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                  <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Financial & Tax Calculators
                  </div>
                  <div className="space-y-1">
                    {calculatorTools.map((calc) => {
                      const Icon = calc.icon;
                      return (
                        <Link
                          key={calc.href}
                          href={calc.href}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50/70 transition group"
                        >
                          <div className="p-2 rounded-lg bg-emerald-100/70 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">{calc.name}</span>
                              {calc.badge && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                                  {calc.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{calc.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Business Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setToolsDropdownOpen(!toolsDropdownOpen);
                  setDocsDropdownOpen(false);
                  setCalcDropdownOpen(false);
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition"
              >
                <span>Business Tools</span>
                <ChevronDown className={`w-4 h-4 transition ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                  <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    WhatsApp & QR Utilities
                  </div>
                  <div className="space-y-1">
                    {businessTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50/70 transition group"
                        >
                          <div className="p-2 rounded-lg bg-purple-100/70 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">{tool.name}</span>
                              {tool.badge && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{tool.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/my-documents"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                pathname === '/my-documents' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              My Documents
            </Link>

            <Link
              href="/pricing"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                pathname === '/pricing' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Pricing
            </Link>

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition flex items-center gap-1.5`}
              >
                <ShieldAlert className="w-4 h-4" /> Admin Panel
              </Link>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.slice(0, 2).toUpperCase() || 'AP'}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-bold text-slate-900 leading-tight truncate max-w-[120px]">{user?.name}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold uppercase">{user?.plan} Plan</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <FolderOpen className="w-4 h-4 text-slate-400" /> Business Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Building2 className="w-4 h-4 text-slate-400" /> Business Profile (GST/Bank)
                    </Link>
                    <Link
                      href="/my-documents"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <FileText className="w-4 h-4 text-slate-400" /> Saved Invoices & Files
                    </Link>
                    <Link
                      href="/pricing"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-amber-700 hover:bg-amber-50"
                    >
                      <Crown className="w-4 h-4 text-amber-500" /> Upgrade Subscription
                    </Link>
                    <div className="border-t border-slate-100 my-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition"
                >
                  Get Started Free
                </Link>
              </div>
            )}

            <Link
              href="/gst-invoice-generator"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Invoice</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/gst-invoice-generator"
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
            >
              + Invoice
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 max-h-[80vh] overflow-y-auto space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Navigation</p>
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50"
            >
              Dashboard
            </Link>
            <Link
              href="/my-documents"
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50"
            >
              My Documents
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50"
            >
              Pricing & Plans
            </Link>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Document Tools</p>
            {documentTools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <t.icon className="w-4 h-4 text-blue-600" />
                <span>{t.name}</span>
              </Link>
            ))}
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Calculators & Tools</p>
            {calculatorTools.concat(businessTools).map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <t.icon className="w-4 h-4 text-emerald-600" />
                <span>{t.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard/profile"
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs"
                >
                  Edit Business Profile (GST/Bank)
                </Link>
                <button
                  onClick={logout}
                  className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  className="text-center py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-center py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar for quick access */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 flex items-center justify-around shadow-lg no-print">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            pathname === '/' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/gst-invoice-generator"
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            pathname === '/gst-invoice-generator' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <div className="w-9 h-9 -mt-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>Create</span>
        </Link>
        <Link
          href="/gst-calculator"
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            pathname.includes('calculator') ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span>Calc</span>
        </Link>
        <Link
          href="/upi-qr-generator"
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            pathname === '/upi-qr-generator' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span>QR Pay</span>
        </Link>
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            pathname.startsWith('/dashboard') || pathname === '/my-documents' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <FolderOpen className="w-5 h-5" />
          <span>Docs</span>
        </Link>
      </div>
    </header>
  );
}
