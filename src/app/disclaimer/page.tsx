import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { DEFAULT_DISCLAIMER } from '@/lib/constants';

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-800 text-sm leading-relaxed">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900">Statutory Business Disclaimer</h1>
        <p className="text-xs text-slate-500">Legal Notice & Taxation Compliance</p>
      </div>

      <div className="bg-amber-50/80 rounded-3xl p-6 border border-amber-200 text-amber-950 space-y-2 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <h2 className="font-bold text-base">Notice to All Users</h2>
          <p className="text-xs text-amber-900 leading-relaxed mt-1">{DEFAULT_DISCLAIMER}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Not a Substitute for Professional Advice</h2>
          <p>
            BizTools India provides algorithmic calculations, document formatting tools, and sample templates for convenience. The materials provided do not constitute professional chartered accountant (CA), legal, or financial tax advisory services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Tax Rates & Slabs Verification</h2>
          <p>
            While we strive to keep GST rates, HSN codes, and Indian tax calculations current with the latest notifications issued by the GST Council and Central Board of Indirect Taxes and Customs (CBIC), tax rules are subject to change. Business owners should verify applicable rates before filing official GSTR-1, GSTR-3B, or statutory tax returns.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Limitation of Liability</h2>
          <p>
            Under no circumstances shall BizTools India, its founders, or affiliates be liable for any tax penalties, accounting discrepancies, or lost profits resulting from the use of calculations or templates generated on this platform.
          </p>
        </section>
      </div>
    </div>
  );
}
