import React from 'react';

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-800 text-sm leading-relaxed">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900">Refund & Cancellation Policy</h1>
        <p className="text-xs text-slate-500">Last updated: October 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Free Plan Policy</h2>
          <p>
            All standard document creation, calculation tools, and basic QR code generators on BizTools India are free forever without charge.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Pro & Business Subscriptions</h2>
          <p>
            For paid Pro (₹199/mo) and Business (₹499/mo) subscriptions, we offer a <strong>7-Day No-Questions-Asked Money Back Guarantee</strong>. If you are unsatisfied with our premium templates or bulk export tools, email support@biztools.in within 7 days of payment for a 100% full refund to your original payment method.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Cancellation Anytime</h2>
          <p>
            You can cancel recurring subscriptions at any time directly from your billing dashboard. Your Pro features will remain active until the end of your current paid billing period.
          </p>
        </section>
      </div>
    </div>
  );
}
