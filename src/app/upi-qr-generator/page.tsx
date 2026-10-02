'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useAuth } from '@/lib/auth-context';
import { generateUPIUrl, formatINR } from '@/lib/utils';
import {
  QrCode,
  Download,
  Printer,
  Sparkles,
  Smartphone,
  Globe,
  MessageCircle,
  Phone,
  Mail,
  Wifi,
  MapPin,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AdBanner from '@/components/layout/AdBanner';

type QRType = 'upi' | 'url' | 'whatsapp' | 'phone' | 'email' | 'wifi' | 'text' | 'location';

export default function UPIQRGeneratorPage() {
  const { businessProfile } = useAuth();

  const [qrType, setQrType] = useState<QRType>('upi');
  const [darkColor, setDarkColor] = useState('#0f172a');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState(300);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // UPI Fields
  const [upiId, setUpiId] = useState(businessProfile.upiId || 'apexinfotech@hdfcbank');
  const [payeeName, setPayeeName] = useState(businessProfile.businessName || 'Apex Infotech Solutions');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState('Payment to Shop');

  // Other Type Fields
  const [url, setUrl] = useState('https://apexinfotech.in');
  const [whatsappNumber, setWhatsappNumber] = useState(businessProfile.whatsapp || '+919876543210');
  const [whatsappText, setWhatsappText] = useState('Hello! I would like to inquire about your business services.');
  const [phoneNumber, setPhoneNumber] = useState(businessProfile.phone || '+919876543210');
  const [emailAddress, setEmailAddress] = useState(businessProfile.email || 'contact@apexinfotech.in');
  const [wifiSsid, setWifiSsid] = useState('Apex_Guest_WiFi');
  const [wifiPassword, setWifiPassword] = useState('Bharat@2026');
  const [wifiType, setWifiType] = useState('WPA');
  const [plainText, setPlainText] = useState('Welcome to our business store!');
  const [locationLatLong, setLocationLatLong] = useState('12.9352,77.6245');

  // Generate QR code data string
  const getQRValue = (): string => {
    switch (qrType) {
      case 'upi':
        return generateUPIUrl({
          upiId,
          payeeName,
          amount: amount && Number(amount) > 0 ? Number(amount) : undefined,
          note,
        });
      case 'url':
        return url.startsWith('http') ? url : `https://${url}`;
      case 'whatsapp':
        return `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappText)}`;
      case 'phone':
        return `tel:${phoneNumber.replace(/\s+/g, '')}`;
      case 'email':
        return `mailto:${emailAddress}`;
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiType};P:${wifiPassword};;`;
      case 'location':
        return `https://maps.google.com/?q=${encodeURIComponent(locationLatLong)}`;
      case 'text':
      default:
        return plainText;
    }
  };

  useEffect(() => {
    const rawVal = getQRValue();
    QRCode.toDataURL(rawVal, {
      width: qrSize,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor,
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR creation error', err));
  }, [
    qrType,
    upiId,
    payeeName,
    amount,
    note,
    url,
    whatsappNumber,
    whatsappText,
    phoneNumber,
    emailAddress,
    wifiSsid,
    wifiPassword,
    wifiType,
    plainText,
    locationLatLong,
    darkColor,
    lightColor,
    qrSize,
  ]);

  const handleDownloadPNG = () => {
    const link = document.createElement('a');
    link.download = `BizTools-QR-${qrType}-${Date.now()}.png`;
    link.href = qrDataUrl;
    link.click();
    confetti({ particleCount: 40, spread: 60 });
  };

  const handlePrintBadge = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
          <QrCode className="w-4 h-4" />
          <span>NPCI UPI & Multi-Purpose QR Suite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Business QR Code Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Generate high-resolution UPI payment QR codes for Google Pay, PhonePe, Paytm, BHIM, as well as Website URLs, WhatsApp, WiFi, and Counter Badges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: QR Type & Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* QR Type Selector Buttons */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select QR Code Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'upi', name: 'UPI Payment', icon: Smartphone, badge: 'Popular' },
                { id: 'url', name: 'Website URL', icon: Globe },
                { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle },
                { id: 'phone', name: 'Phone Call', icon: Phone },
                { id: 'email', name: 'Email Address', icon: Mail },
                { id: 'wifi', name: 'Wi-Fi Network', icon: Wifi },
                { id: 'location', name: 'Google Map', icon: MapPin },
                { id: 'text', name: 'Plain Text', icon: Sparkles },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setQrType(t.id as QRType)}
                    className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition border ${
                      qrType === t.id
                        ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-purple-600" />
                    <span>{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Inputs Form */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 uppercase tracking-wider text-xs">
              {qrType === 'upi'
                ? 'UPI Payment Parameters'
                : qrType === 'url'
                ? 'Website Details'
                : qrType === 'whatsapp'
                ? 'WhatsApp Chat Details'
                : qrType === 'wifi'
                ? 'Wi-Fi Credentials'
                : 'QR Data Content'}
            </h3>

            {/* UPI */}
            {qrType === 'upi' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Merchant UPI ID (VPA) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. shopname@okhdfcbank / 9876543210@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Supports GPay, PhonePe, Paytm, AmazonPay, BHIM</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Business / Payee Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Infotech"
                      value={payeeName}
                      onChange={(e) => setPayeeName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Fixed Amount (₹ Optional)
                    </label>
                    <input
                      type="number"
                      placeholder="Leave blank for any amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Transaction Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Billing Counter 1"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* URL */}
            {qrType === 'url' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Website URL *</label>
                <input
                  type="url"
                  placeholder="https://yourwebsite.in"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
            )}

            {/* WhatsApp */}
            {qrType === 'whatsapp' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+919876543210"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pre-filled Message</label>
                  <textarea
                    rows={3}
                    value={whatsappText}
                    onChange={(e) => setWhatsappText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* Wi-Fi */}
            {qrType === 'wifi' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Network SSID (Name) *</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Wi-Fi Password</label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* Customization Options */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">QR Foreground Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-slate-600 uppercase">{darkColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-slate-600 uppercase">{lightColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Printable Standee & Download Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center sticky top-24">
            {/* Printable Counter Badge Card */}
            <div
              id="printable-qr-standee"
              className="print-area w-full max-w-[320px] rounded-3xl p-6 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white shadow-xl border-4 border-purple-500/30 flex flex-col items-center space-y-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  {qrType === 'upi' ? 'Scan & Pay via UPI' : 'Scan With Phone'}
                </span>
                <h3 className="text-lg font-black tracking-tight text-white line-clamp-1">{payeeName}</h3>
              </div>

              {/* QR Image */}
              <div className="p-3 bg-white rounded-2xl shadow-md">
                {qrDataUrl && (
                  <img src={qrDataUrl} alt="Generated QR" className="w-52 h-52 rounded-lg" />
                )}
              </div>

              {/* Footer details on badge */}
              <div className="space-y-1 text-center">
                {qrType === 'upi' && (
                  <>
                    <p className="text-xs font-mono font-bold text-amber-300">{upiId}</p>
                    {amount && Number(amount) > 0 && (
                      <p className="text-sm font-black text-emerald-400">Exact Amount: {formatINR(Number(amount))}</p>
                    )}
                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
                      <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                    </div>
                  </>
                )}
                {qrType !== 'upi' && (
                  <p className="text-[11px] text-slate-300 font-mono line-clamp-1 max-w-[240px]">
                    {getQRValue()}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2.5 pt-6 no-print">
              <button
                onClick={handleDownloadPNG}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res PNG</span>
              </button>

              <button
                onClick={handlePrintBadge}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Counter Standee</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
