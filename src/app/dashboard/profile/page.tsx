'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { INDIAN_STATES } from '@/lib/constants';
import { validateGSTIN, validatePAN, validatePincode, validatePhone } from '@/lib/utils';
import { Building2, Landmark, QrCode, Check, Save, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BusinessProfilePage() {
  const { businessProfile, updateBusinessProfile } = useAuth();
  const [profile, setProfile] = useState(businessProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!profile.businessName.trim()) {
      newErrors.businessName = 'Business Name is required';
    }
    if (profile.gstin && !validateGSTIN(profile.gstin)) {
      newErrors.gstin = 'Invalid GSTIN format (15 characters standard e.g. 29ABCDE1234F1Z5)';
    }
    if (profile.pan && !validatePAN(profile.pan)) {
      newErrors.pan = 'Invalid PAN format (10 characters e.g. ABCDE1234F)';
    }
    if (profile.pincode && !validatePincode(profile.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    updateBusinessProfile(profile);
    setSaveSuccess(true);
    confetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <Building2 className="w-4 h-4" />
          <span>Business Master Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Business Profile & Bank Details
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Save your business details, GSTIN, PAN, bank accounts, and UPI ID. They will automatically auto-populate on all your invoices, salary slips, and receipts.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Basic Business Identity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Business Entity Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Business / Firm Name *</label>
              <input
                type="text"
                value={profile.businessName}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.businessName && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.businessName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Owner / Authorized Signatory Name</label>
              <input
                type="text"
                value={profile.ownerName}
                onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN Number (15 Characters)</label>
              <input
                type="text"
                maxLength={15}
                placeholder="29ABCDE1234F1Z5"
                value={profile.gstin || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    gstin: e.target.value.toUpperCase(),
                    pan: e.target.value.length >= 12 ? e.target.value.slice(2, 12).toUpperCase() : profile.pan,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
              />
              {errors.gstin && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.gstin}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">PAN Number (10 Characters)</label>
              <input
                type="text"
                maxLength={10}
                placeholder="ABCDE1234F"
                value={profile.pan || ''}
                onChange={(e) => setProfile({ ...profile, pan: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
              />
              {errors.pan && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.pan}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Business Number</label>
              <input
                type="tel"
                value={profile.whatsapp}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Business Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Website URL</label>
              <input
                type="url"
                value={profile.website || ''}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* 2. Registered Address */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Registered Business Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / Building</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
              <select
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s.code + s.name} value={s.name}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City / District *</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pincode (6 Digits) *</label>
              <input
                type="text"
                maxLength={6}
                value={profile.pincode}
                onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
              {errors.pincode && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.pincode}</p>}
            </div>
          </div>
        </div>

        {/* 3. Bank Details & UPI ID */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-600" />
            <span>Bank Settlement & UPI Configuration</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                placeholder="e.g. HDFC Bank Ltd"
                value={profile.bankName || ''}
                onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Holder Name</label>
              <input
                type="text"
                value={profile.accountHolderName || ''}
                onChange={(e) => setProfile({ ...profile, accountHolderName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
              <input
                type="text"
                value={profile.accountNumber || ''}
                onChange={(e) => setProfile({ ...profile, accountNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bank IFSC Code</label>
              <input
                type="text"
                placeholder="HDFC0001234"
                value={profile.ifsc || ''}
                onChange={(e) => setProfile({ ...profile, ifsc: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase font-bold text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Merchant UPI ID (for auto Invoice QR Code) *
              </label>
              <input
                type="text"
                placeholder="e.g. apexinfotech@hdfcbank"
                value={profile.upiId || ''}
                onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Every generated invoice will include a scannable UPI QR code linking to this ID.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Profile Saved Successfully!
            </span>
          )}
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Business Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
