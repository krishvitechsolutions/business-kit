'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { BusinessCardData } from '@/lib/types';
import { generateUPIUrl } from '@/lib/utils';
import { Phone, Mail, Globe, MapPin, Building2, Sparkles, Send } from 'lucide-react';

interface BusinessCardTemplateProps {
  card: BusinessCardData;
  id?: string;
  side?: 'front' | 'back' | 'both';
}

export default function BusinessCardTemplate({ card, id = 'business-card-element', side = 'both' }: BusinessCardTemplateProps) {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    let qrPayload = card.website || 'https://biztools.in';
    if (card.qrCodeType === 'upi' && card.upiId) {
      qrPayload = generateUPIUrl({
        upiId: card.upiId,
        payeeName: card.businessName,
        note: `Payment to ${card.name}`,
      });
    } else if (card.qrCodeType === 'whatsapp' && card.whatsapp) {
      qrPayload = `https://wa.me/${card.whatsapp.replace(/\D/g, '')}`;
    } else if (card.qrCodeType === 'vcard') {
      qrPayload = `BEGIN:VCARD\nVERSION:3.0\nN:${card.name}\nORG:${card.businessName}\nTITLE:${card.designation}\nTEL:${card.phone}\nEMAIL:${card.email}\nURL:${card.website}\nEND:VCARD`;
    }

    QRCode.toDataURL(qrPayload, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error(err));
  }, [card.qrCodeType, card.upiId, card.whatsapp, card.website, card.name, card.businessName, card.designation, card.phone, card.email]);

  const themes = {
    'modern-blue': {
      front: 'bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white shadow-xl',
      back: 'bg-white text-slate-900 border border-slate-200 shadow-xl',
      accent: 'text-blue-400',
      badge: 'bg-blue-600/30 text-blue-200 border border-blue-400/30',
    },
    'dark-gold': {
      front: 'bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white shadow-xl border border-amber-500/20',
      back: 'bg-slate-900 text-amber-100 border border-amber-500/20 shadow-xl',
      accent: 'text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    'creative-gradient': {
      front: 'bg-gradient-to-tr from-purple-700 via-pink-600 to-amber-500 text-white shadow-xl',
      back: 'bg-slate-950 text-slate-100 border border-purple-500/20 shadow-xl',
      accent: 'text-pink-300',
      badge: 'bg-white/20 text-white',
    },
    'minimal-clean': {
      front: 'bg-slate-900 text-white shadow-xl border border-slate-800',
      back: 'bg-white text-slate-900 border border-slate-200 shadow-xl',
      accent: 'text-slate-400',
      badge: 'bg-slate-100 text-slate-800',
    },
    'corporate-navy': {
      front: 'bg-gradient-to-r from-slate-900 to-blue-950 text-white shadow-xl border-l-8 border-emerald-500',
      back: 'bg-slate-50 text-slate-900 border border-slate-200 shadow-xl',
      accent: 'text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300',
    },
  }[card.theme || 'modern-blue'];

  return (
    <div id={id} className="print-area flex flex-col md:flex-row items-center justify-center gap-8 py-6">
      {/* FRONT SIDE (Standard Visiting Card Ratio 3.5in x 2in -> ~450px x 250px) */}
      {(side === 'both' || side === 'front') && (
        <div
          className={`w-full max-w-[440px] h-[250px] rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${themes.front}`}
        >
          {/* Decorative subtle circles */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-blue-500/20 blur-lg pointer-events-none" />

          {/* Top Row: Business Name & Category */}
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className={`w-5 h-5 ${themes.accent}`} />
                <h3 className="font-black text-lg tracking-tight uppercase leading-none">{card.businessName}</h3>
              </div>
              {card.tagline && <p className="text-[11px] opacity-80 mt-1 line-clamp-1">{card.tagline}</p>}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${themes.badge}`}>
              🇮🇳 India
            </span>
          </div>

          {/* Bottom Row: Name, Designation & Quick Icon */}
          <div className="relative z-10">
            <h2 className="text-xl font-black tracking-tight">{card.name}</h2>
            <p className={`text-xs font-semibold ${themes.accent} tracking-wide uppercase mt-0.5`}>{card.designation}</p>
            <div className="flex items-center gap-4 text-[11px] opacity-90 pt-3">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3" /> {card.phone}
              </span>
              {card.email && (
                <span className="flex items-center gap-1 truncate max-w-[180px]">
                  <Mail className="w-3 h-3" /> {card.email}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BACK SIDE */}
      {(side === 'both' || side === 'back') && (
        <div
          className={`w-full max-w-[440px] h-[250px] rounded-2xl p-6 flex flex-row items-center justify-between relative overflow-hidden transition-all duration-300 ${themes.back}`}
        >
          {/* Left Details */}
          <div className="space-y-2 text-xs flex-1 pr-4">
            <div className="pb-1 border-b border-slate-200/50">
              <p className="font-extrabold text-sm">{card.name}</p>
              <p className="text-[11px] text-slate-500">{card.businessName}</p>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-mono">{card.phone}</span>
              </div>
              {card.whatsapp && (
                <div className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-mono">WA: {card.whatsapp}</span>
                </div>
              )}
              {card.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{card.email}</span>
                </div>
              )}
              {card.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate">{card.website.replace('https://', '')}</span>
                </div>
              )}
              {card.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-tight text-slate-500">{card.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right QR Code Block */}
          {qrUrl && (
            <div className="shrink-0 flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
              <img src={qrUrl} alt="Contact / UPI QR" className="w-20 h-20" />
              <span className="text-[9px] font-bold text-slate-700 uppercase mt-1 tracking-wider">
                {card.qrCodeType === 'upi' ? 'Scan to Pay' : 'Scan Contact'}
              </span>
              {card.upiId && card.qrCodeType === 'upi' && (
                <span className="text-[8px] font-mono text-blue-700 font-bold max-w-[85px] truncate">
                  {card.upiId}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
