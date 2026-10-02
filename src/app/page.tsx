'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Calculator,
  QrCode,
  FileCheck,
  Building2,
  Receipt,
  CreditCard,
  Sparkles,
  Percent,
  TrendingUp,
  MessageSquare,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Star,
  Users,
  Zap,
  Smartphone,
  Award,
  Globe2,
  Truck,
  Target,
  Tag,
  Activity,
  Coins,
} from 'lucide-react';
import AdBanner from '@/components/layout/AdBanner';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const popularTools = [
    {
      id: 'gst-invoice',
      name: 'GST Tax Invoice Maker',
      category: 'Document Generator',
      desc: 'Generate compliant B2B & B2C GST invoices with CGST/SGST/IGST, HSN codes, and instant UPI QR code.',
      icon: FileText,
      href: '/gst-invoice-generator',
      color: 'bg-blue-600',
      tag: 'Most Popular',
    },
    {
      id: 'delivery-challan',
      name: 'Delivery Challan (Rule 55)',
      category: 'Goods Movement',
      desc: 'Create statutory GST DRC delivery challans for Job Work, Supply on Approval, Exhibition, and Inter-branch.',
      icon: Truck,
      href: '/delivery-challan-generator',
      color: 'bg-orange-600',
      tag: 'New Tool',
    },
    {
      id: 'quotation',
      name: 'Quotation / Price Estimate',
      category: 'Sales Proposals',
      desc: 'Create and email/WhatsApp professional estimates with validity dates and 1-click invoice conversion.',
      icon: FileCheck,
      href: '/quotation-maker',
      color: 'bg-indigo-600',
      tag: 'High Demand',
    },
    {
      id: 'gst-calc',
      name: 'GST Calculator (Add / Remove)',
      category: 'Tax Calculator',
      desc: 'Calculate exact 0%, 5%, 12%, 18%, 28% GST amounts or extract base price from MRP in milliseconds.',
      icon: Percent,
      href: '/gst-calculator',
      color: 'bg-emerald-600',
      tag: 'Instant Calc',
    },
    {
      id: 'break-even',
      name: 'Break-Even Point (BEP) Calc',
      category: 'Profitability',
      desc: 'Find units and revenue needed to cover fixed costs and achieve target monthly profits.',
      icon: Target,
      href: '/break-even-calculator',
      color: 'bg-amber-500',
      tag: 'New Tool',
    },
    {
      id: 'tds-calc',
      name: 'TDS & TCS Tax Calculator',
      category: 'Income Tax',
      desc: 'Calculate statutory TDS for contractors (194C), professional fees (194J), rent (194I), and PAN checks.',
      icon: ShieldCheck,
      href: '/tds-calculator',
      color: 'bg-blue-700',
      tag: 'FY 2025-26',
    },
    {
      id: 'discount-calc',
      name: 'Discount & Schemes Calc',
      category: 'Pricing Strategy',
      desc: 'Calculate multi-tier discounts (20%+10%), Buy X Get Y Free deals, and early cash payment discounts.',
      icon: Tag,
      href: '/discount-calculator',
      color: 'bg-rose-600',
    },
    {
      id: 'working-capital',
      name: 'Working Capital Health',
      category: 'Liquidity & Cashflow',
      desc: 'Current Ratio (bank 1.33 benchmark), Quick Ratio, and Operating Cash Cycle (DSO) calculation.',
      icon: Activity,
      href: '/working-capital-calculator',
      color: 'bg-teal-600',
    },
    {
      id: 'salary-calc',
      name: 'CTC to In-Hand Salary Calc',
      category: 'Payroll & HR',
      desc: 'Convert annual CTC into monthly take-home salary after EPF, PT, Gratuity, and New Tax Regime.',
      icon: CreditCard,
      href: '/salary-calculator',
      color: 'bg-sky-600',
    },
    {
      id: 'upi-qr',
      name: 'UPI & Business Payment QR',
      category: 'Payments',
      desc: 'Generate clean QR codes for GPay, PhonePe, Paytm, BHIM with your custom logo and print badge.',
      icon: QrCode,
      href: '/upi-qr-generator',
      color: 'bg-purple-600',
      tag: 'Free Tool',
    },
    {
      id: 'salary-slip',
      name: 'Salary Slip / Payslip Maker',
      category: 'HR & Payroll',
      desc: 'Create monthly salary slips for staff with Basic, HRA, EPF (12%), ESI, Professional Tax (PT), and TDS.',
      icon: CreditCard,
      href: '/salary-slip-generator',
      color: 'bg-cyan-600',
    },
    {
      id: 'purchase-order',
      name: 'Purchase Order (PO) Maker',
      category: 'Procurement',
      desc: 'Send formal purchase orders to manufacturers and vendors with delivery terms and GST breakdown.',
      icon: Building2,
      href: '/purchase-order-generator',
      color: 'bg-slate-800',
    },
    {
      id: 'receipt',
      name: 'Payment Receipt Generator',
      category: 'Accounting',
      desc: 'Issue digital and printable payment receipts for cash, UPI, cheque, and bank transfers.',
      icon: Receipt,
      href: '/receipt-generator',
      color: 'bg-teal-700',
    },
    {
      id: 'profit-calc',
      name: 'Profit Margin & Markup Calc',
      category: 'Financial Analytics',
      desc: 'Calculate gross profit, net margin percentage, unit margins, and product break-even prices.',
      icon: TrendingUp,
      href: '/profit-margin-calculator',
      color: 'bg-amber-600',
    },
    {
      id: 'expense-calc',
      name: 'Business Expense Tracker',
      category: 'Bookkeeping',
      desc: 'Log rent, salaries, electricity, marketing & software expenses with instant category visual charts.',
      icon: Calculator,
      href: '/expense-calculator',
      color: 'bg-violet-600',
    },
    {
      id: 'emi-calc',
      name: 'Business Loan EMI Calculator',
      category: 'Loans & Capital',
      desc: 'Calculate monthly EMI, interest breakdown, and amortization schedule for machinery & MSME loans.',
      icon: Coins,
      href: '/emi-calculator',
      color: 'bg-cyan-700',
    },
    {
      id: 'business-card',
      name: 'Visiting Card Designer',
      category: 'Branding',
      desc: 'Design double-sided Indian business cards with dynamic contact details and UPI payment QR code.',
      icon: Sparkles,
      href: '/business-card-maker',
      color: 'bg-pink-600',
    },
    {
      id: 'wa-catalogue',
      name: 'WhatsApp Product Catalogue',
      category: 'E-commerce',
      desc: 'Display products with discounts and direct "Order on WhatsApp" button for mobile customers.',
      icon: ShoppingBag,
      href: '/whatsapp-catalogue',
      color: 'bg-emerald-700',
    },
  ];

  const testimonials = [
    {
      quote:
        'BizTools India has replaced our clunky desktop billing software. We generate over 40 GST invoices each week directly on mobile and send them on WhatsApp with UPI QR code attached!',
      name: 'Ramesh Patel',
      role: 'Owner, Patel Textiles & Sarees',
      city: 'Surat, Gujarat',
      rating: 5,
    },
    {
      quote:
        'The GST calculator and Quotation to Invoice workflow is exceptionally smooth. As a freelance UI consultant, I get paid twice as fast because clients can simply scan the QR to pay via GPay.',
      name: 'Ananya Deshmukh',
      role: 'Independent Tech Consultant',
      city: 'Pune, Maharashtra',
      rating: 5,
    },
    {
      quote:
        'Generating formal salary slips with PF and PT deductions used to take hours in Excel. With BizTools India, payslips are ready in 30 seconds and exported to beautiful A4 PDFs.',
      name: 'Vikramjit Singh',
      role: 'Founder, TrippleCraft Logistics',
      city: 'Gurugram, Haryana',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: 'Is BizTools India really free to use?',
      a: 'Yes! All core tools—including GST Invoice generator, Quotation maker, Calculators, UPI QR generator, and Salary slips—are 100% free to use. You can generate unlimited standard documents and download PDFs without any watermark or subscription.',
    },
    {
      q: 'Are the GST Invoices compliant with Indian tax laws?',
      a: 'Yes. Invoices created on BizTools India follow standard Indian GST rules, including HSN/SAC codes, CGST/SGST/IGST separation for inter-state vs intra-state supply, reverse charge indicators, amount in words in Indian Rupees, and seller/buyer GSTIN details.',
    },
    {
      q: 'Does it work on mobile phones?',
      a: 'Absolutely! BizTools India is built with mobile-first responsive architecture. You can create invoices, share payment reminders on WhatsApp, and calculate GST right from your smartphone browser.',
    },
    {
      q: 'Is my business and financial data secure?',
      a: 'Yes. All your document calculations and profile data are stored securely in your browser and account. We never share your customer data or business revenues with any third party.',
    },
    {
      q: 'How does the UPI QR code on the invoice work?',
      a: 'When you enter your UPI ID (e.g. yourbusiness@okhdfcbank), BizTools automatically generates an NPCI-compliant UPI payment QR code on the invoice. Your customer can simply scan the invoice with Google Pay, PhonePe, Paytm, or BHIM to pay the exact bill amount directly into your bank account!',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-slate-50">
        {/* Background glow dots */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-400/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide shadow-xs animate-in fade-in duration-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Free Business Utility Suite for Indian MSMEs & Freelancers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Everything Your Business Needs,{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                In One Place.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
              Create invoices, quotations, receipts, salary slips, and business documents. Calculate GST, profit,
              expenses, and EMI — completely online & mobile-ready.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/gst-invoice-generator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-base shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5"
              >
                <FileText className="w-5 h-5" />
                <span>Create Free Invoice</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#tools-grid"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200 shadow-sm transition"
              >
                <span>Explore All 14 Tools</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Free to Start
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant PDF Download
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> WhatsApp & UPI Ready
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No Card Required
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR TOOLS GRID */}
      <section id="tools-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">All-In-One Toolkit</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Popular Business Tools</h2>
          <p className="text-sm text-slate-600">
            Pick a tool to generate professional business documents, calculate Indian taxes, or create payment QR codes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${tool.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    {tool.tag && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {tool.tag}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {tool.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition mt-0.5">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-3">{tool.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Ad Location Banner */}
        <AdBanner slot="content-bottom" />
      </section>

      {/* WHY BIZTOOLS INDIA SECTION */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Tailored for Indian MSMEs
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Why Choose BizTools India?</h2>
            <p className="text-sm text-slate-400">
              Designed from ground up for Indian shopkeepers, freelancers, startups, and service providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xl border border-blue-500/30">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Free to Start</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No credit card, no mandatory subscriptions. Generate and download unlimited standard documents right away.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Works on Mobile</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Optimized for smartphone screens so you can create invoices and share payment links right from your shop floor.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center font-bold text-xl border border-purple-500/30">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">WhatsApp & UPI Ready</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Auto-generate NPCI UPI QR codes and 1-click WhatsApp payment reminders with dynamic customer amounts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/30">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Indian Tax Compliant</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Native support for CGST, SGST, IGST, HSN/SAC codes, Indian currency Lakh/Crore words, PAN and GSTIN formatting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Loved by Entrepreneurs</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trusted by 25,000+ Indian Businesses</h2>
          <p className="text-sm text-slate-600">See how small businesses across India power their daily invoicing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {t.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                  <p className="text-[10px] text-blue-600 font-semibold">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Common Questions</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-blue-600 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    openFaq === i ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to Upgrade Your Business Invoicing?
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              Create your first free GST tax invoice in less than 60 seconds. No software installation needed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/gst-invoice-generator"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-sm shadow-md transition"
            >
              Create Free Invoice Now
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-sm border border-blue-400/30 transition"
            >
              View Pro Plans (₹199/mo)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
