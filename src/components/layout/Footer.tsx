import React from 'react';
import Link from 'next/link';
import { FileText, ShieldCheck, Heart, Mail, Phone, MapPin } from 'lucide-react';
import { DEFAULT_DISCLAIMER } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">
                  BizTools<span className="text-blue-400">.in</span>
                </span>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Create • Calculate • Grow
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India&apos;s leading free business utility suite for MSMEs, freelancers, shopkeepers (दुकानदार),
              consultants, and startups. Generate compliant GST invoices, estimate quotations, payslips, UPI payment QR
              codes, and financial reports instantly.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-amber-400 border border-slate-700">
                <span>🇮🇳</span> Designed for Bharat Businesses
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Secure & Client-Side
              </span>
            </div>
          </div>

          {/* Col 2: Document Generators */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Document Makers</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/gst-invoice-generator" className="hover:text-blue-400 transition">
                  GST Invoice Maker
                </Link>
              </li>
              <li>
                <Link href="/quotation-maker" className="hover:text-blue-400 transition">
                  Quotation Generator
                </Link>
              </li>
              <li>
                <Link href="/delivery-challan-generator" className="hover:text-blue-400 transition">
                  Delivery Challan (Rule 55)
                </Link>
              </li>
              <li>
                <Link href="/purchase-order-generator" className="hover:text-blue-400 transition">
                  Purchase Order (PO)
                </Link>
              </li>
              <li>
                <Link href="/receipt-generator" className="hover:text-blue-400 transition">
                  Payment Receipt Maker
                </Link>
              </li>
              <li>
                <Link href="/salary-slip-generator" className="hover:text-blue-400 transition">
                  Salary Slip Generator
                </Link>
              </li>
              <li>
                <Link href="/business-card-maker" className="hover:text-blue-400 transition">
                  Visiting Card Designer
                </Link>
              </li>
              <li>
                <Link href="/pdf-invoice" className="hover:text-blue-400 transition">
                  PDF Invoice Importer
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Calculators & Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Calculators & Tools</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/gst-calculator" className="hover:text-blue-400 transition">
                  GST Calculator (Add/Remove)
                </Link>
              </li>
              <li>
                <Link href="/profit-margin-calculator" className="hover:text-blue-400 transition">
                  Profit Margin & Markup
                </Link>
              </li>
              <li>
                <Link href="/break-even-calculator" className="hover:text-blue-400 transition">
                  Break-Even Point (BEP)
                </Link>
              </li>
              <li>
                <Link href="/tds-calculator" className="hover:text-blue-400 transition">
                  TDS & TCS Tax Calculator
                </Link>
              </li>
              <li>
                <Link href="/discount-calculator" className="hover:text-blue-400 transition">
                  Discount & Bulk Schemes
                </Link>
              </li>
              <li>
                <Link href="/working-capital-calculator" className="hover:text-blue-400 transition">
                  Working Capital Health
                </Link>
              </li>
              <li>
                <Link href="/salary-calculator" className="hover:text-blue-400 transition">
                  CTC to In-Hand Salary
                </Link>
              </li>
              <li>
                <Link href="/expense-calculator" className="hover:text-blue-400 transition">
                  Expense Tracker & Chart
                </Link>
              </li>
              <li>
                <Link href="/emi-calculator" className="hover:text-blue-400 transition">
                  Business Loan EMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/upi-qr-generator" className="hover:text-blue-400 transition">
                  UPI & Payment QR Code
                </Link>
              </li>
              <li>
                <Link href="/whatsapp-payment-reminder" className="hover:text-blue-400 transition">
                  WhatsApp Payment Reminder
                </Link>
              </li>
              <li>
                <Link href="/whatsapp-catalogue" className="hover:text-blue-400 transition">
                  WhatsApp Product Catalogue
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Company & Legal</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition">
                  About BizTools India
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-blue-400 transition">
                  Pricing & Pro Upgrade
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition">
                  Contact & WhatsApp Help
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-blue-400 transition">
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-blue-400 transition">
                  Statutory Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-8 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">Important Statutory Disclaimer:</p>
          <p>{DEFAULT_DISCLAIMER}</p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BizTools India (BizTools.in). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Entrepreneurs
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
