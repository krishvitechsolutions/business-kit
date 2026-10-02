import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-800 text-sm leading-relaxed">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Effective Date: October 2026 | Compliant with Indian Information Technology Act</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            BizTools India (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) respects your privacy. When using our document generators and calculators, data such as business names, GSTINs, PAN numbers, and customer invoices is processed primarily within your client browser and secure local storage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. How We Use Business Data</h2>
          <p>
            Your information is used solely to generate PDF invoices, calculate GST amounts, create QR codes, and maintain your account records. We do <strong>NOT</strong> sell, rent, or monetize your customer databases, item rates, or financial transactions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Security & Cloud Safeguards</h2>
          <p>
            All network communication is encrypted using 256-bit SSL/TLS. Sensitive tokens and session keys are secured using industry-standard authorization protocols.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">4. Contact Grievance Officer</h2>
          <p>
            In accordance with the Information Technology Act 2000 and Rules made thereunder, the Grievance Officer can be contacted at <strong>privacy@biztools.in</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
