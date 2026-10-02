'use client';

import React, { useState } from 'react';
import { storage } from '@/lib/storage';
import { ContactMessage } from '@/lib/types';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('MSME Retail / Kirana');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      phone,
      businessType,
      message,
      createdAt: new Date().toISOString(),
      status: 'unread',
    };

    storage.saveContactMessage(newMsg);
    setSubmitted(true);
    confetti({ particleCount: 35, spread: 45 });
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          We&apos;re Here to Support Your Business
        </h1>
        <p className="text-sm text-slate-600">
          Have feedback, feature requests, or need help configuring your GST invoices? Reach out to our dedicated support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-base">Office & Support Desk</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Phone Support (Mon-Sat, 9AM-7PM IST)</p>
                  <p className="text-slate-600 font-mono mt-0.5">+91 80 4999 8888</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">WhatsApp Helpdesk</p>
                  <p className="text-slate-600 font-mono mt-0.5">+91 98765 43210</p>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20BizTools%20India%2C%20I%20have%20a%20query%20about%20my%20business%20invoices"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold hover:underline inline-block mt-1"
                  >
                    Chat on WhatsApp →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Email Support</p>
                  <p className="text-slate-600 font-mono mt-0.5">support@biztools.in</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Headquarters</p>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    BizTools Technologies India Pvt Ltd<br />
                    Outer Ring Road, Koramangala Tech Zone<br />
                    Bengaluru, Karnataka 560034, India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-base">Send Us a Direct Message</h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-950 text-base">Message Sent Successfully!</h4>
                <p className="text-xs text-emerald-800">
                  Thank you for contacting BizTools India. Our Indian support team will review your inquiry within 4 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@business.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Business Type</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white"
                    >
                      <option value="MSME Retail / Kirana">MSME Retail / Kirana (दुकानदार)</option>
                      <option value="IT / Software / SaaS">IT / Software / SaaS</option>
                      <option value="Freelancer / Consultant">Freelancer / Consultant</option>
                      <option value="Manufacturing / Textiles">Manufacturing / Textiles</option>
                      <option value="Accounting / CA Firm">Accounting / CA Firm</option>
                      <option value="Other">Other Business</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Message / Feedback *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us how we can assist you..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
