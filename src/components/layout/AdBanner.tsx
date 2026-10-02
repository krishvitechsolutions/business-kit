'use client';

import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface AdBannerProps {
  slot?: 'top-banner' | 'sidebar' | 'content-bottom' | 'calculator-result';
  className?: string;
}

export default function AdBanner({ slot = 'content-bottom', className = '' }: AdBannerProps) {
  if (slot === 'calculator-result') {
    return (
      <div className={`p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white border border-blue-800/40 shadow-sm ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/50 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">Sponsored Partner</p>
              <h4 className="text-sm font-bold text-white">Collateral-Free Business Loans up to ₹50 Lakhs for MSMEs</h4>
              <p className="text-xs text-blue-200">Instant approval in 24 hours with lowest interest rates from verified NBFCs.</p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shrink-0 transition"
          >
            <span>Check Eligibility</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  if (slot === 'sidebar') {
    return (
      <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          <span>Promoted</span>
          <span>Ad</span>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 text-xs">Register Trademark & GST in 3 Days</h4>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Protect your business brand name with expert CA/CS guidance. Over 50,000+ Indian businesses served.
          </p>
        </div>
        <Link
          href="/pricing"
          className="block text-center py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition"
        >
          Explore BizTools Pro (Ad-Free)
        </Link>
      </div>
    );
  }

  return (
    <div className={`my-8 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700 text-xs flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="px-2 py-1 rounded bg-slate-200 text-[10px] font-bold text-slate-600 uppercase">
          Ad
        </div>
        <p className="text-xs text-slate-600">
          <strong className="text-slate-900">Go Ad-Free & Unlock Unlimited GST Invoicing:</strong> Get unlimited cloud storage, custom watermarks, and team access for ₹199/month.
        </p>
      </div>
      <Link
        href="/pricing"
        className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 transition"
      >
        Upgrade to Pro
      </Link>
    </div>
  );
}
