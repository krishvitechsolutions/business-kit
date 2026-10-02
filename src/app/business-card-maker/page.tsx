'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { BusinessCardData } from '@/lib/types';
import { storage } from '@/lib/storage';
import BusinessCardTemplate from '@/components/documents/BusinessCardTemplate';
import { exportElementToPDF } from '@/lib/pdf';
import { Sparkles, Download, Printer, Palette, Building2, User, Phone, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BusinessCardMakerPage() {
  const { businessProfile } = useAuth();
  const [downloading, setDownloading] = useState(false);

  const [card, setCard] = useState<BusinessCardData>({
    id: `bc-${Date.now()}`,
    userId: 'user-01',
    name: businessProfile.ownerName || 'Rajesh Sharma',
    designation: 'Managing Director & Consultant',
    businessName: businessProfile.businessName || 'Apex Infotech Solutions',
    tagline: 'Empowering Indian Businesses with Next-Gen Digital Tools',
    phone: businessProfile.phone || '+91 98765 43210',
    whatsapp: businessProfile.whatsapp || '+91 98765 43210',
    email: businessProfile.email || 'rajesh@apexinfotech.in',
    website: businessProfile.website || 'https://apexinfotech.in',
    address: `${businessProfile.city || 'Bengaluru'}, ${businessProfile.state || 'Karnataka'} - ${businessProfile.pincode || '560034'}`,
    theme: 'modern-blue',
    qrCodeType: 'upi',
    upiId: businessProfile.upiId || 'apexinfotech@hdfcbank',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/rajesh-sharma',
    },
    createdAt: new Date().toISOString(),
  });

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await exportElementToPDF({
        elementId: 'business-card-element',
        fileName: `BusinessCard-${card.name.replace(/\s+/g, '_')}`,
        orientation: 'landscape',
      });
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleSave = () => {
    storage.saveBusinessCard(card);
    confetti({ particleCount: 30, spread: 45 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-pink-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Digital & Printable Visiting Cards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Business Card Maker
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Design double-sided professional Indian visiting cards with customized themes, instant UPI QR codes, and PDF export.
          </p>
        </div>

        <div className="flex items-center gap-3 no-print">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition"
          >
            <Printer className="w-4 h-4 inline mr-1.5" />
            <span>Print Cards</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md shadow-pink-500/20 transition"
          >
            <Download className="w-4 h-4 inline mr-1.5" />
            <span>{downloading ? 'Exporting...' : 'Download Card PDF'}</span>
          </button>
        </div>
      </div>

      {/* Live Preview Canvas */}
      <div className="bg-slate-100/70 p-6 sm:p-10 rounded-3xl border border-slate-200 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Double-Sided Live Preview (Front & Back)
        </span>
        <BusinessCardTemplate card={card} id="business-card-element" side="both" />
      </div>

      {/* Customizer Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Themes & QR Type */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-pink-600" />
              <span>Select Design Theme</span>
            </label>
            <div className="space-y-2">
              {[
                { id: 'modern-blue', name: 'Executive Ocean Blue', desc: 'Vibrant indigo & blue gradient' },
                { id: 'dark-gold', name: 'Premium Dark & Gold', desc: 'Luxury black with amber accents' },
                { id: 'corporate-navy', name: 'Corporate Emerald Navy', desc: 'Classic navy with emerald border' },
                { id: 'creative-gradient', name: 'Creative Sunset Gradient', desc: 'Purple, pink & orange blend' },
                { id: 'minimal-clean', name: 'Minimalist Monochromatic', desc: 'Crisp black & white contrast' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setCard({ ...card, theme: t.id as any })}
                  className={`w-full p-3 rounded-xl text-left transition border ${
                    card.theme === t.id
                      ? 'bg-pink-50 border-pink-500 text-pink-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs">{t.name}</p>
                  <p className="text-[10px] text-slate-500 font-normal">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <QrCode className="w-4 h-4 text-purple-600" />
              <span>Backside QR Code Action</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'upi', name: 'UPI Pay QR' },
                { id: 'vcard', name: 'Contact vCard' },
                { id: 'whatsapp', name: 'WhatsApp' },
                { id: 'website', name: 'Website Link' },
              ].map((q) => (
                <button
                  key={q.id}
                  onClick={() => setCard({ ...card, qrCodeType: q.id as any })}
                  className={`p-2.5 rounded-xl text-xs font-bold border text-center transition ${
                    card.qrCodeType === q.id
                      ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {q.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Card Details Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-pink-600" />
              <span>Card Personal & Company Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Title *</label>
                <input
                  type="text"
                  value={card.designation}
                  onChange={(e) => setCard({ ...card, designation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Business / Brand Name *</label>
                <input
                  type="text"
                  value={card.businessName}
                  onChange={(e) => setCard({ ...card, businessName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tagline / Motto</label>
                <input
                  type="text"
                  value={card.tagline || ''}
                  onChange={(e) => setCard({ ...card, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={card.phone}
                  onChange={(e) => setCard({ ...card, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  value={card.whatsapp}
                  onChange={(e) => setCard({ ...card, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={card.email}
                  onChange={(e) => setCard({ ...card, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Website URL</label>
                <input
                  type="url"
                  value={card.website}
                  onChange={(e) => setCard({ ...card, website: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">UPI ID (for QR Code)</label>
                <input
                  type="text"
                  value={card.upiId || ''}
                  onChange={(e) => setCard({ ...card, upiId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Office / Shop Location</label>
                <input
                  type="text"
                  value={card.address}
                  onChange={(e) => setCard({ ...card, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md transition"
              >
                Save Business Card Design
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
