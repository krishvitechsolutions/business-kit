import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-800 text-sm leading-relaxed">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-500">Last updated: October 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using BizTools India (biztools.in), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use our document generation and calculation services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Free and Pro SaaS Services</h2>
          <p>
            BizTools India provides free and paid subscription tools for business owners, freelancers, and enterprises. Users are granted a non-exclusive license to generate, download, and distribute business documents created through the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. User Responsibility & Compliance</h2>
          <p>
            Users are solely responsible for verifying the accuracy of tax rates (CGST, SGST, IGST), HSN codes, PAN numbers, and legal invoices issued to their clients. BizTools India is not a chartered accountancy or legal advisory firm.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">4. Governing Law & Jurisdiction</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of the use of this website shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
          </p>
        </section>
      </div>
    </div>
  );
}
