import React from 'react';
import { FileText, ShieldCheck, Heart, Award, Users, Globe2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
          <span>🇮🇳 Made for Indian MSMEs & Freelancers</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Empowering Bharat&apos;s Entrepreneurs to Create, Calculate & Grow
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          BizTools India was founded with a singular mission: to make everyday business documentation, GST compliance, and financial calculators 100% free, mobile-ready, and simple for 63+ million Indian micro, small, and medium enterprises.
        </p>
      </div>

      {/* Story Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">Our Story & Vision</h2>
        <p>
          Running a business in India is challenging. From filing GST and creating quotations to preparing monthly salary slips and collecting customer payments via UPI, small business owners (दुकानदारs, consultants, agencies, contractors) spend hours navigating complicated, expensive software that requires technical training.
        </p>
        <p>
          BizTools India changes that. We built an instant, browser-based business workbench where you can create professional tax invoices with embedded UPI QR codes in 30 seconds, calculate reverse GST from MRP, track monthly expenses, and share payment reminders straight to WhatsApp without complex logins or mandatory credit cards.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 text-center">
          <div className="space-y-1">
            <p className="text-3xl font-black text-blue-600">25,000+</p>
            <p className="text-xs font-bold text-slate-500 uppercase">Businesses Supported</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-emerald-600">180,000+</p>
            <p className="text-xs font-bold text-slate-500 uppercase">Documents Generated</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-purple-600">100% Free</p>
            <p className="text-xs font-bold text-slate-500 uppercase">Core Tools Forever</p>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Indian Business First</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Native support for Indian number systems (Lakhs & Crores), CGST/SGST/IGST tax slabs, UPI payment QRs, and PAN/GSTIN validations built-in.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Zero Data Monetization</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your client lists, invoice totals, and revenue numbers are never sold or shared with any third party. Your business data belongs to you.
          </p>
        </div>
      </div>
    </div>
  );
}
